from __future__ import annotations

from typing import Sequence

import pandas as pd

from rule import Rule


def accuracy_score(y_true: Sequence[str], y_pred: Sequence[str]) -> float:
    if len(y_true) == 0:
        return 0.0
    correct = sum(1 for true_value, pred_value in zip(y_true, y_pred) if true_value == pred_value)
    return correct / len(y_true)


def confusion_matrix_table(
    y_true: Sequence[str],
    y_pred: Sequence[str],
    class_labels: list[str],
) -> pd.DataFrame:
    matrix = pd.DataFrame(0, index=class_labels, columns=class_labels)

    for true_value, pred_value in zip(y_true, y_pred):
        matrix.loc[true_value, pred_value] += 1

    matrix.index.name = "skutocna_trieda"
    matrix.columns.name = "predikovana_trieda"
    return matrix


def rule_consistency(rule: Rule) -> float:
    return rule.consistency()


def rule_completeness(rule: Rule, class_total: int) -> float:
    return rule.completeness(class_total)


def average_rule_cost(rules: list[Rule]) -> float:
    if not rules:
        return 0.0
    return sum(rule.cost() for rule in rules) / len(rules)


def summarize_rules(
    rules: list[Rule],
    reference_df: pd.DataFrame,
    target_column: str,
) -> pd.DataFrame:
    rows = []

    class_totals = reference_df[target_column].value_counts().to_dict()

    for rule in rules:
        class_total = class_totals.get(rule.predicted_class, 0)
        rows.append(
            {
                "rule_id": rule.order,
                "rule_text": rule.to_text(),
                "predicted_class": rule.predicted_class,
                "laplace_score": rule.laplace_score,
                "coverage": rule.coverage,
                "class_coverage": rule.class_coverage,
                "cost": rule.cost(),
                "consistency": rule.consistency(),
                "completeness": rule.completeness(class_total),
                "learned_on_size": rule.learned_on_size,
            }
        )

    return pd.DataFrame(rows)


def evaluate_predictions(
    y_true: Sequence[str],
    y_pred: Sequence[str],
    class_labels: list[str],
) -> dict:
    cm = confusion_matrix_table(y_true, y_pred, class_labels)
    acc = accuracy_score(y_true, y_pred)

    return {
        "accuracy": acc,
        "confusion_matrix": cm,
    }