from datetime import datetime

from pydantic import BaseModel, Field


class AboutContent(BaseModel):
    bio: str = ""
    skills: list[str] = Field(default_factory=list)
    experience: list["ExperienceItem"] = Field(default_factory=list)
    freelance_profile: "FreelanceProfile | None" = Field(default=None, alias="freelanceProfile")


class FreelanceFeaturePrice(BaseModel):
    feature: str
    price: float | None = None
    notes: str = ""
    related_project_slugs: list[str] = Field(default_factory=list, alias="relatedProjectSlugs")

    model_config = {"populate_by_name": True}


class FreelanceProjectReference(BaseModel):
    slug: str
    title: str
    notes: str = ""


class FreelanceProfile(BaseModel):
    hourly_rate: float | None = Field(default=None, alias="hourlyRate")
    currency: str = "IDR"
    completed_projects: int | None = Field(default=None, alias="completedProjects")
    pricing_notes: str = Field(default="", alias="pricingNotes")
    feature_pricing: list[FreelanceFeaturePrice] = Field(
        default_factory=list, alias="featurePricing"
    )
    project_references: list[FreelanceProjectReference] = Field(
        default_factory=list, alias="projectReferences"
    )

    model_config = {"populate_by_name": True}


class ExperienceItem(BaseModel):
    type: str
    title: str
    organization: str
    start_date: str = Field(alias="startDate")
    end_date: str | None = Field(default=None, alias="endDate")
    location: str | None = None
    description: str | None = None
    logo_url: str | None = Field(default=None, alias="logoUrl")

    model_config = {"populate_by_name": True}


class ProjectContext(BaseModel):
    title: str
    content: str = ""


class ProjectContent(BaseModel):
    title: str
    slug: str
    summary: str = ""
    description: str = ""
    content: str = ""
    tech_stack: list[str] = Field(default_factory=list, alias="techStack")
    contexts: list[ProjectContext] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class KnowledgeDocument(BaseModel):
    id: str
    filename: str
    content: str = ""
    indexed: bool = False


class ContentExport(BaseModel):
    about_me: AboutContent = Field(alias="aboutMe")
    projects: list[ProjectContent] = Field(default_factory=list)
    knowledge_docs: list[KnowledgeDocument] = Field(default_factory=list, alias="knowledgeDocs")

    model_config = {"populate_by_name": True}


class FreelanceIntentContext(BaseModel):
    freelance_profile: FreelanceProfile | None = Field(default=None, alias="freelanceProfile")

    model_config = {"populate_by_name": True}


class ChatLogMessageMetadata(BaseModel):
    model: str | None = None
    provider: str | None = None
    tokens: int | None = None
    duration: int | None = None


class ChatLogMessage(BaseModel):
    id: str | None = None
    role: str
    content: str
    timestamp: datetime | str
    metadata: ChatLogMessageMetadata | None = None


class ChatLogRecord(BaseModel):
    session_id: str = Field(alias="sessionId")
    messages: list[ChatLogMessage] = Field(default_factory=list)

    model_config = {"populate_by_name": True}
