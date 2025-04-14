# Use official .NET SDK image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Copy csproj and restore dependencies
COPY ./uniPoint_backend.csproj ./
RUN dotnet restore ./uniPoint_backend.csproj

# Copy the rest of the code
COPY . ./

# Build and publish the app
RUN dotnet publish ./uniPoint_backend.csproj -c Release -o out

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

ENTRYPOINT ["dotnet", "uniPoint_backend.dll"]