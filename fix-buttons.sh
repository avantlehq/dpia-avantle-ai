#!/bin/bash
# Script to fix button classes in remaining files

# Create a list of files to fix
files=(
    "src/app/risk/page.tsx"
    "src/app/training/page.tsx" 
    "src/app/trust-center/page.tsx"
)

for file in "${files[@]}"; do
    echo "Fixing buttons in $file..."
    
    # Replace the old button pattern with Button component
    # This is a simplified approach - will need manual verification
    
    echo "File needs manual fix: $file"
done

echo "Manual fixes needed for proper Button component migration"