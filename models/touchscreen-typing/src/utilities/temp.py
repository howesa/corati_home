import numpy
from itertools import product

layout = [['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', 's', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
          ['-', '-', '-', ' ', ' ', ' ', ' ', ' ', '-', '-', '-']]

# save array
#numpy.save('../../layouts/three_key_layout.npy', layout)

# load array
data = numpy.load('../../layouts/two_key_layout.npy')
# print the array
print(data)
# foo = numpy.where(data == 'm')
# d = [numpy.where(data == 'm')[0][0], numpy.where(data == 'm')[1][0]]
# print(numpy.hstack(foo))
