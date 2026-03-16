from app.services.repository import RetrievedChunk, merge_retrieved_chunks


def test_merge_retrieved_chunks_combines_dense_and_lexical_scores() -> None:
    dense = [
        RetrievedChunk(
            source="project:sample-project",
            content="Chunk body",
            contextual_content="Chunk context",
            score=0.82,
            metadata={"route": "/projects/sample-project"},
            dense_score=0.82,
            lexical_score=0.0,
            match_reasons=["dense"],
        )
    ]
    lexical = [
        RetrievedChunk(
            source="project:sample-project",
            content="Chunk body",
            contextual_content="Chunk context",
            score=0.9,
            metadata={"route": "/projects/sample-project"},
            dense_score=0.0,
            lexical_score=0.9,
            match_reasons=["lexical"],
        ),
        RetrievedChunk(
            source="about:naufal",
            content="About body",
            contextual_content="About context",
            score=0.3,
            metadata={"route": "/about"},
            dense_score=0.0,
            lexical_score=0.3,
            match_reasons=["lexical"],
        ),
    ]

    merged = merge_retrieved_chunks(dense, lexical, 5)

    assert merged[0].source == "project:sample-project"
    assert merged[0].dense_score == 0.82
    assert merged[0].lexical_score == 1.0
    assert set(merged[0].match_reasons) == {"dense", "lexical"}
    assert merged[1].source == "about:naufal"
