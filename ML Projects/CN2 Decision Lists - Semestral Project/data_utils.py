from __future__ import annotations

from typing import Iterable

import pandas as pd


def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    return df


def validate_dataset(df: pd.DataFrame, target_column: str) -> None:
    if df.empty:
        raise ValueError("Dataset je prázdny.")

    if target_column not in df.columns:
        raise ValueError(f"V datasete chýba cieľový stĺpec: {target_column}")

    if df.columns[-1] != target_column:
        raise ValueError("Cieľový stĺpec musí byť posledný.")

    if df.isnull().any().any():
        raise ValueError("Dataset obsahuje chýbajúce hodnoty.")

    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            raise ValueError(
                f"Stĺpec '{column}' je numerický. "
                "Táto implementácia pracuje s kategorickými atribútmi."
            )

    for column in df.columns:
        df[column] = df[column].astype(str).str.strip()

    if (df == "").any().any():
        raise ValueError("Dataset obsahuje prázdne reťazce.")


def get_attribute_columns(df: pd.DataFrame, target_column: str) -> list[str]:
    return [column for column in df.columns if column != target_column]


def get_unique_values(df: pd.DataFrame, columns: Iterable[str]) -> dict[str, list[str]]:
    unique_values: dict[str, list[str]] = {}
    for column in columns:
        unique_values[column] = sorted(df[column].astype(str).unique().tolist())
    return unique_values


def train_test_split_custom(
    df: pd.DataFrame,
    target_column: str,
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[pd.DataFrame, pd.DataFrame]:
    if not 0 < test_size < 1:
        raise ValueError("test_size musí byť v intervale (0, 1).")

    grouped = []
    for _, class_df in df.groupby(target_column, sort=False):
        class_df = class_df.sample(frac=1.0, random_state=random_state)
        test_count = max(1, int(round(len(class_df) * test_size)))
        test_part = class_df.iloc[:test_count]
        train_part = class_df.iloc[test_count:]
        grouped.append((train_part, test_part))

    train_df = pd.concat([train_part for train_part, _ in grouped], axis=0)
    test_df = pd.concat([test_part for _, test_part in grouped], axis=0)

    train_df = train_df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    test_df = test_df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)

    return train_df, test_df