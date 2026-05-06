from __future__ import annotations

import argparse
import json
from pathlib import Path

import pandas as pd

from cn2 import CN2Classifier
from config import (
    DEFAULT_BEAM_WIDTH,
    DEFAULT_DATASET_PATH,
    DEFAULT_MAX_RULE_LENGTH,
    DEFAULT_MIN_COVERAGE,
    DEFAULT_RANDOM_STATE,
    DEFAULT_TARGET_COLUMN,
    DEFAULT_TEST_SIZE,
    METRICS_DIR,
    RULES_DIR,
    TABLES_DIR,
)
from data_utils import load_dataset, train_test_split_custom, validate_dataset
from metrics import average_rule_cost, evaluate_predictions, summarize_rules


def ensure_output_dirs() -> None:
    RULES_DIR.mkdir(parents=True, exist_ok=True)
    METRICS_DIR.mkdir(parents=True, exist_ok=True)
    TABLES_DIR.mkdir(parents=True, exist_ok=True)


def save_rules(rules_text: list[str], path: Path) -> None:
    with open(path, "w", encoding="utf-8") as file:
        file.write("\n".join(rules_text))


def save_metrics(metrics_dict: dict, path: Path) -> None:
    serializable = {}
    for key, value in metrics_dict.items():
        if isinstance(value, pd.DataFrame):
            continue
        serializable[key] = value

    with open(path, "w", encoding="utf-8") as file:
        json.dump(serializable, file, indent=4, ensure_ascii=False)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="CN2 klasifikátor pre kategorické dáta.")
    parser.add_argument("--dataset", type=str, default=str(DEFAULT_DATASET_PATH))
    parser.add_argument("--target", type=str, default=DEFAULT_TARGET_COLUMN)
    parser.add_argument("--test-size", type=float, default=DEFAULT_TEST_SIZE)
    parser.add_argument("--seed", type=int, default=DEFAULT_RANDOM_STATE)
    parser.add_argument("--beam-width", type=int, default=DEFAULT_BEAM_WIDTH)
    parser.add_argument("--min-coverage", type=int, default=DEFAULT_MIN_COVERAGE)
    parser.add_argument("--max-rule-length", type=int, default=DEFAULT_MAX_RULE_LENGTH)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    ensure_output_dirs()

    df = load_dataset(args.dataset)
    validate_dataset(df, args.target)

    train_df, test_df = train_test_split_custom(
        df=df,
        target_column=args.target,
        test_size=args.test_size,
        random_state=args.seed,
    )

    model = CN2Classifier(
        beam_width=args.beam_width,
        min_coverage=args.min_coverage,
        target_column=args.target,
        max_rule_length=args.max_rule_length,
    )
    model.fit(train_df)

    y_true = test_df[args.target].astype(str).tolist()
    y_pred = model.predict(test_df)

    evaluation = evaluate_predictions(y_true, y_pred, model.class_labels)
    rules_summary_df = summarize_rules(model.rules, train_df, args.target)

    metrics_dict = {
        "dataset": args.dataset,
        "target_column": args.target,
        "beam_width": args.beam_width,
        "min_coverage": args.min_coverage,
        "max_rule_length": args.max_rule_length,
        "train_size": len(train_df),
        "test_size": len(test_df),
        "rule_count": len(model.rules),
        "average_rule_cost": average_rule_cost(model.rules),
        "default_class": model.default_class,
        "accuracy": evaluation["accuracy"],
    }

    rules_text = model.get_rules_text()

    save_rules(rules_text, RULES_DIR / "learned_rules.txt")
    save_metrics(metrics_dict, METRICS_DIR / "metrics.json")
    evaluation["confusion_matrix"].to_csv(TABLES_DIR / "confusion_matrix.csv", encoding="utf-8")
    rules_summary_df.to_csv(TABLES_DIR / "rule_summary.csv", index=False, encoding="utf-8")

    print("Naučené pravidlá:")
    print("-" * 60)
    for line in rules_text:
        print(line)

    print("\nMetriky:")
    print("-" * 60)
    for key, value in metrics_dict.items():
        print(f"{key}: {value}")

    print("\nConfusion matrix:")
    print("-" * 60)
    print(evaluation["confusion_matrix"])


if __name__ == "__main__":
    main()