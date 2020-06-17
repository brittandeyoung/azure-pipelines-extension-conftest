package main

deny[msg] {
  input.test.value = "bad"
  msg = "This is bad"
}