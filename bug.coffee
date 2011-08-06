# Bugs in coffeescript

t1 = () ->
  l = [
    1,
    2,
    3,
  ]
  l

t2 = () ->
  l = [
    1,
    2,
    3,
  ]
  l[0]

t3 = () ->
  l = [
    1,
    2,
    3,]
  l

t4 = () ->
  l = [
    1,
    2,
    3,]
  l[0]
