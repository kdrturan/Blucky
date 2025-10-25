#!/bin/bash
# Sui Move Test Script
# Usage: ./test.sh

echo "🧪 Sui Move Test Script"
echo "========================"
echo ""

# Check if sui is installed
echo "Checking Sui CLI installation..."
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI not found!"
    echo ""
    echo "Please install Sui CLI first:"
    echo "1. Install Rust from https://rustup.rs/"
    echo "2. Run: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch mainnet sui"
    echo ""
    echo "Or see TEST_GUIDE_TR.md for detailed instructions."
    exit 1
fi

# Show Sui version
echo "✅ Sui CLI found: $(sui --version)"

# Navigate to contracts directory
cd contracts || exit 1

echo ""
echo "📦 Building the Move package..."
sui move build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    
    echo "🧪 Running tests..."
    sui move test --verbose
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ All tests passed! 🎉"
    else
        echo ""
        echo "❌ Some tests failed. Check the output above."
        exit 1
    fi
else
    echo "❌ Build failed. Check the errors above."
    exit 1
fi

# Return to root directory
cd ..

echo ""
echo "✨ Test script completed successfully!"


