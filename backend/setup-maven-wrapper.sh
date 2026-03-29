#!/bin/bash
# Run this once after cloning to set up the Maven wrapper
# Requires Maven to be installed: https://maven.apache.org/install.html
mvn wrapper:wrapper -Dmaven=3.9.5
echo "Maven wrapper created. You can now use ./mvnw"
