"""Smoke tests unitários: imports básicos e helpers puros (sem I/O externo)."""

import pytest


@pytest.mark.unit
def test_import_core_modules():
    """Os módulos principais do agente importam sem efeitos colaterais de rede."""
    from app.agent import tools, helpers, new_react  # noqa: F401

    assert hasattr(tools, "cadastrar_lead")
    assert hasattr(new_react, "create_react_executor")


@pytest.mark.unit
def test_is_uuid():
    from app.agent.tools import is_uuid

    assert is_uuid("11111111-2222-3333-4444-555555555555")
    assert not is_uuid("nao-e-um-uuid")


@pytest.mark.unit
def test_normalize_phone():
    from app.agent.tools import normalize_phone

    assert normalize_phone("+351 912 345 678") == "351912345678"
    assert normalize_phone("") == ""
