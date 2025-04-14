# Use the official .NET SDK image to build and publish
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Use the SDK image to build the application
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the .csproj file and restore any dependencies (via dotnet restore)
COPY ./uniPoint_backend/uniPoint_backend.csproj ./uniPoint_backend/
RUN dotnet restore ./uniPoint_backend/uniPoint_backend.csproj

# Copy the rest of the application and build
COPY . .
WORKDIR /src/uniPoint_backend
RUN dotnet publish -c Release -o /app/publish

# Final stage
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "uniPoint_backend.dll"]
