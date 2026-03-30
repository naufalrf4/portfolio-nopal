ALTER TABLE "AboutMe"
ALTER COLUMN "skills" TYPE jsonb
USING (
  CASE
    WHEN "skills" IS NULL THEN '[]'::jsonb
    ELSE (
      SELECT jsonb_agg(
        jsonb_build_object(
          'name', skill,
          'level', 85,
          'category', CASE
            WHEN lower(skill) LIKE '%react%'
              OR lower(skill) LIKE '%next%'
              OR lower(skill) LIKE '%tailwind%'
              OR lower(skill) LIKE '%typescript%'
              OR lower(skill) LIKE '%javascript%'
              THEN 'Web Development'
            WHEN lower(skill) LIKE '%postgres%'
              OR lower(skill) LIKE '%mysql%'
              OR lower(skill) LIKE '%supabase%'
              THEN 'Data & Backend'
            WHEN lower(skill) LIKE '%iot%'
              OR lower(skill) LIKE '%esp32%'
              OR lower(skill) LIKE '%mqtt%'
              THEN 'IoT Systems'
            WHEN lower(skill) LIKE '%rag%'
              OR lower(skill) LIKE '%ai%'
              OR lower(skill) LIKE '%langchain%'
              OR lower(skill) LIKE '%openai%'
              THEN 'AI & Automation'
            WHEN lower(skill) LIKE '%docker%'
              OR lower(skill) LIKE '%bash%'
              OR lower(skill) LIKE '%aws%'
              THEN 'Cloud & DevOps'
            ELSE 'Tools & Workflow'
          END
        )
      )
      FROM unnest("skills") AS skill
    )
  END
);

ALTER TABLE "AboutMe"
ALTER COLUMN "skills" SET DEFAULT '[]'::jsonb;
