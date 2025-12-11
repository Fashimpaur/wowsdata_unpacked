from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Starter API"
    app_env: str = "development"
    app_port: int = 8000

    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "postgres"
    db_password: str = "postgres"
    db_name: str = "appdb"

    oauth_client_id: str | None = None
    oauth_client_secret: str | None = None
    oauth_authorization_url: str | None = None
    oauth_token_url: str | None = None
    oauth_redirect_uri: str | None = None

    model_config = SettingsConfigDict(env_file=(".env",), env_prefix="", case_sensitive=False)

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()
