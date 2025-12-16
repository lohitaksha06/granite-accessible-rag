"""Thin Granite model helper to load and generate locally."""

from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "ibm-granite/granite-4.0-micro"


def load_granite_model():
    """Load Granite tokenizer and model from Hugging Face."""
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        torch_dtype=torch.float32,
        device_map="auto",
    )
    return tokenizer, model


def generate_response(prompt: str, max_tokens: int = 200):
    """Produce a response from the Granite model for a given prompt."""
    tokenizer, model = load_granite_model()

    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(
        **inputs,
        max_new_tokens=max_tokens,
    )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)
