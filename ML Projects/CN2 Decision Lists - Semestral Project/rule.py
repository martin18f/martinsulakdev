from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Iterable


@dataclass(frozen=True, order=True)
class Selector:
    attribute: str
    value: str

    def matches(self, example: Any) -> bool:
        return str(example[self.attribute]) == self.value

    def to_text(self) -> str:
        return f"{self.attribute} = {self.value}"


@dataclass(frozen=True)
class Complex:
    selectors: tuple[Selector, ...] = field(default_factory=tuple)

    def matches(self, example: Any) -> bool:
        return all(selector.matches(example) for selector in self.selectors)

    def used_attributes(self) -> set[str]:
        return {selector.attribute for selector in self.selectors}

    def can_add(self, selector: Selector) -> bool:
        return selector.attribute not in self.used_attributes()

    def specialize(self, selector: Selector) -> "Complex":
        if not self.can_add(selector):
            raise ValueError("Komplex už obsahuje selektor s týmto atribútom.")

        new_selectors = tuple(sorted(self.selectors + (selector,)))
        return Complex(selectors=new_selectors)

    def cost(self) -> int:
        return len(self.selectors)

    def is_empty(self) -> bool:
        return len(self.selectors) == 0

    def to_text(self) -> str:
        if self.is_empty():
            return "TRUE"
        return " AND ".join(selector.to_text() for selector in self.selectors)


@dataclass
class Rule:
    complex_part: Complex
    predicted_class: str
    laplace_score: float | None = None
    coverage: int = 0
    class_coverage: int = 0
    learned_on_size: int = 0
    order: int = 0

    def matches(self, example: Any) -> bool:
        return self.complex_part.matches(example)

    def predict(self, example: Any) -> str | None:
        if self.matches(example):
            return self.predicted_class
        return None

    def cost(self) -> int:
        return self.complex_part.cost()

    def consistency(self) -> float:
        if self.coverage == 0:
            return 0.0
        return self.class_coverage / self.coverage

    def completeness(self, class_total: int) -> float:
        if class_total == 0:
            return 0.0
        return self.class_coverage / class_total

    def to_text(self) -> str:
        return f"IF {self.complex_part.to_text()} THEN {self.predicted_class}"


def selectors_to_text(selectors: Iterable[Selector]) -> list[str]:
    return [selector.to_text() for selector in selectors]