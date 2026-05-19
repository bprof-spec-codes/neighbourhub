# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS builder

WORKDIR /src

# Copy solution and global settings
COPY ["NeighboutrHub.sln", "./"]
COPY ["global.json", "./"]

# Copy project files
COPY ["Endpoint/Endpoint.csproj", "Endpoint/"]
COPY ["Data/Data.csproj", "Data/"]
COPY ["Entities/Entities.csproj", "Entities/"]
COPY ["Logic/Logic.csproj", "Logic/"]

# Restore dependencies for the web project
RUN dotnet restore "Endpoint/Endpoint.csproj"

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build "Endpoint/Endpoint.csproj" -c Release -o /app/build

# Publish the application
RUN dotnet publish "Endpoint/Endpoint.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app

# Copy published app from builder
COPY --from=builder /app/publish .

# Expose ports used by ASP.NET Core
EXPOSE 5000
EXPOSE 5001

# Set environment to Production
ENV ASPNETCORE_ENVIRONMENT=Production

# Run the application
ENTRYPOINT ["dotnet", "Endpoint.dll"]
