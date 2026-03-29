FROM maven:3.9.6-eclipse-temurin-17

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

# Find and run correct jar
CMD ["sh", "-c", "java -jar $(ls target/*.jar | head -n 1)"]