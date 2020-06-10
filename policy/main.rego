package main

import data.aws

# Testing Tags

deny[msg] {
  input.test.value = "bad"
  msg = "This is bad"
}