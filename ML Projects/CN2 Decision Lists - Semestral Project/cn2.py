from __future__ import annotations

from collections import Counter
from dataclasses import asdict
from typing import Any

import pandas as pd

from rule import Complex, Rule, Selector


class CN2Classifier:
    def __init__(
        self,
        beam_width: int = 5,
        min_coverage: int = 2,
        target_column: str = "class",
        max_rule_length: int | None = 4,
    ) -> None:
        self.beam_width = beam_width
        self.min_coverage = min_coverage
        self.target_column = target_column
        self.max_rule_length = max_rule_length

        self.rules: list[Rule] = []
        self.default_class: str | None = None
        self.class_labels: list[str] = []
        self.attribute_columns: list[str] = []
        self.is_fitted: bool = False

    def fit(self, train_df: pd.DataFrame) -> "CN2Classifier":
        if train_df.empty:
            raise ValueError("Trénovacia množina je prázdna.")

        self.rules = []
        self.class_labels = sorted(train_df[self.target_column].astype(str).unique().tolist())
        self.attribute_columns = [
            column for column in train_df.columns if column != self.target_column
        ]

        remaining_df = train_df.copy().reset_index(drop=True)
        rule_order = 1

        while not remaining_df.empty:
            best_complex, best_score, covered_df = self._find_best_complex(remaining_df)

            if best_complex is None:
                break

            if covered_df.empty:
                break

            predicted_class = self._majority_class(covered_df)
            class_coverage = int((covered_df[self.target_column] == predicted_class).sum())

            if best_complex.is_empty():
                break

            rule = Rule(
                complex_part=best_complex,
                predicted_class=predicted_class,
                laplace_score=best_score,
                coverage=len(covered_df),
                class_coverage=class_coverage,
                learned_on_size=len(remaining_df),
                order=rule_order,
            )
            self.rules.append(rule)

            remaining_df = self._remove_covered_examples(remaining_df, best_complex)
            rule_order += 1

        if remaining_df.empty:
            self.default_class = self._majority_class(train_df)
        else:
            self.default_class = self._majority_class(remaining_df)

        self.is_fitted = True
        return self

    def predict_one(self, example: Any) -> str:
        self._check_is_fitted()

        for rule in self.rules:
            if rule.matches(example):
                return rule.predicted_class

        if self.default_class is None:
            raise ValueError("Defaultná trieda nie je nastavená.")

        return self.default_class

    def predict(self, test_df: pd.DataFrame) -> list[str]:
        self._check_is_fitted()
        return [self.predict_one(row) for _, row in test_df.iterrows()]

    def get_rules_text(self) -> list[str]:
        self._check_is_fitted()

        lines = []
        for rule in self.rules:
            lines.append(f"Rule {rule.order}: {rule.to_text()}")

        lines.append(f"Default: {self.default_class}")
        return lines

    def _find_best_complex(
        self,
        df: pd.DataFrame,
    ) -> tuple[Complex | None, float | None, pd.DataFrame]:
        selectors = self._generate_selectors(df)

        star: list[Complex] = [Complex()]
        best_complex: Complex | None = None
        best_score: float = float("-inf")
        best_covered_df = pd.DataFrame(columns=df.columns)

        while True:
            candidate_info = {}

            for complex_obj in star:
                for selector in selectors:
                    if not complex_obj.can_add(selector):
                        continue

                    new_complex = complex_obj.specialize(selector)

                    if self.max_rule_length is not None and new_complex.cost() > self.max_rule_length:
                        continue

                    if new_complex in candidate_info:
                        continue

                    covered_df = self._covered_examples(df, new_complex)

                    if len(covered_df) < self.min_coverage:
                        continue

                    score = self._laplace_score(covered_df)

                    candidate_info[new_complex] = {
                        "score": score,
                        "covered_df": covered_df,
                        "coverage": len(covered_df),
                        "class_coverage": self._majority_class_count(covered_df),
                        "cost": new_complex.cost(),
                    }

            if not candidate_info:
                break

            ranked = sorted(
                candidate_info.items(),
                key=lambda item: (
                    item[1]["score"],
                    item[1]["class_coverage"],
                    item[1]["coverage"],
                    -item[1]["cost"],
                ),
                reverse=True,
            )

            top_candidates = ranked[: self.beam_width]
            star = [complex_obj for complex_obj, _ in top_candidates]

            top_complex, top_info = top_candidates[0]

            is_better = (
                top_info["score"] > best_score
                or (
                    top_info["score"] == best_score
                    and top_info["class_coverage"] > self._majority_class_count(best_covered_df)
                )
                or (
                    top_info["score"] == best_score
                    and top_info["class_coverage"] == self._majority_class_count(best_covered_df)
                    and len(top_info["covered_df"]) > len(best_covered_df)
                )
                or (
                    top_info["score"] == best_score
                    and top_info["class_coverage"] == self._majority_class_count(best_covered_df)
                    and len(top_info["covered_df"]) == len(best_covered_df)
                    and top_complex.cost() < (best_complex.cost() if best_complex else float("inf"))
                )
            )

            if is_better:
                best_complex = top_complex
                best_score = float(top_info["score"])
                best_covered_df = top_info["covered_df"]

        if best_complex is None:
            return None, None, pd.DataFrame(columns=df.columns)

        return best_complex, best_score, best_covered_df

    def _generate_selectors(self, df: pd.DataFrame) -> list[Selector]:
        selectors: list[Selector] = []

        for attribute in self.attribute_columns:
            values = sorted(df[attribute].astype(str).unique().tolist())
            for value in values:
                selectors.append(Selector(attribute=attribute, value=value))

        return selectors

    def _covered_examples(self, df: pd.DataFrame, complex_obj: Complex) -> pd.DataFrame:
        if complex_obj.is_empty():
            return df.copy()

        mask = df.apply(lambda row: complex_obj.matches(row), axis=1)
        return df[mask].copy().reset_index(drop=True)

    def _remove_covered_examples(self, df: pd.DataFrame, complex_obj: Complex) -> pd.DataFrame:
        mask = df.apply(lambda row: complex_obj.matches(row), axis=1)
        return df[~mask].copy().reset_index(drop=True)

    def _laplace_score(self, covered_df: pd.DataFrame) -> float:
        if covered_df.empty:
            return 0.0

        n = len(covered_df)
        k = len(self.class_labels)
        class_counts = covered_df[self.target_column].value_counts().to_dict()

        scores = []
        for class_label in self.class_labels:
            n_c = class_counts.get(class_label, 0)
            score = (n_c + 1) / (n + k)
            scores.append(score)

        return max(scores)

    def _majority_class(self, df: pd.DataFrame) -> str:
        if df.empty:
            raise ValueError("Nie je možné určiť majoritnú triedu z prázdnej množiny.")

        counts = Counter(df[self.target_column].astype(str).tolist())
        sorted_counts = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
        return sorted_counts[0][0]

    def _majority_class_count(self, df: pd.DataFrame) -> int:
        if df.empty:
            return 0

        counts = Counter(df[self.target_column].astype(str).tolist())
        return max(counts.values())

    def _check_is_fitted(self) -> None:
        if not self.is_fitted:
            raise ValueError("Model ešte nebol natrénovaný.")