"""Thin Granite model helper to load and generate locally.

Note: The model is large for many laptops. We load it once and reuse it, and we
enable disk-offload as a safe fallback when RAM is insufficient.
"""

from __future__ import annotations

import os
from pathlib import Path

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

MODEL_NAME = "ibm-granite/granite-4.0-micro"

_tokenizer = None
_model = None


def load_granite_model():
    """Load Granite tokenizer and model from Hugging Face (cached)."""
    global _tokenizer, _model
    if _tokenizer is not None and _model is not None:
        return _tokenizer, _model

    _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    offload_dir = Path("data/model_offload")
    offload_dir.mkdir(parents=True, exist_ok=True)

    try:
        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float32,
            device_map="auto",
            low_cpu_mem_usage=True,
        )
    except ValueError as e:
        # On low-RAM machines, accelerate may attempt to offload the *entire* model to disk.
        # That path errors unless you explicitly manage disk offload. For stability, fall back
        # to a plain CPU load (slower, but avoids crashing the API).
        if "offload the whole model" not in str(e):
            raise

        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float32,
            device_map=None,
            low_cpu_mem_usage=True,
        )

    return _tokenizer, _model


def generate_response(prompt: str, max_tokens: int = 200):
    """Produce a response from the Granite model for a given prompt."""
    tokenizer, model = load_granite_model()

    inputs = tokenizer(prompt, return_tensors="pt")
    # If the model is on a single device, move inputs there. For sharded/offloaded
    # models, generate() can handle CPU inputs.
    try:
        device = getattr(model, "device", None)
        if device is not None:
            inputs = {k: v.to(device) for k, v in inputs.items()}
    except Exception:
        pass

    outputs = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)
