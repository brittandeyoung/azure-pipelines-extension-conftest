package main

# Test tagging rules

test_success {
  deny == set() with input as {"test": {"value": "good"}}
}

test_fail {
  deny with input as {"test": {"value": "good"}}
}