"""Accessibility and language profile definitions for Granite Accessible RAG."""

from dataclasses import dataclass
from typing import Literal


AccessibilityMode = Literal["deaf", "blind", "cognitive"]


@dataclass(frozen=True)
class UserProfile:
    """Captures user accessibility and localization preferences."""

    language: str
    accessibility_mode: AccessibilityMode


def get_default_profiles() -> list[UserProfile]:
    """Seed a few baseline profiles for early testing."""
    return [
        UserProfile(language="en", accessibility_mode="deaf"),
        UserProfile(language="en", accessibility_mode="blind"),
        UserProfile(language="en", accessibility_mode="cognitive"),
    ]
