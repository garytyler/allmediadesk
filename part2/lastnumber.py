"""
Notes:

23245
22999

Iterate digits:
    if digits[i] > digits[i+1]:
        digits[i] = digits[i] - 1

# above doesn't work if digits[i] is 1 and digits[i+1] is 0

110
99

112
112

120
119

1010
999

11010
9999

21010
2999

12010
11999

12110
11999

Iterate digits:
    if digits[i] > digits[i+1]:
        if digits[i+1] is 0 and digits[i] is 1:
            Change digits[i+n] to 9s, reduce len by 1
        else:
            Change digits[i+1+n] to 9s and decrement digits[i] by 1

33245
32999
29999

# Approach 1: convert with recursion, convert from str on each step, slow

33245 - (33245 % 33000) - 1
32999 - (32999 % 30000) - 1

n - (n % place)

n=110
(110 % 10) = 0

# Approach 2: Parse digits with modulo

"""
import sys
import unittest


class TestFindPetersLastNumber(unittest.TestCase):
    def test_find_peters_last_number(self):
        for arg, res in [
            (110, 99),
            (112, 112),
            (23245, 22999),
            (11235888, 11235888),
            (111110, 99999),
            (33245, 29999),
            (1010, 999),
            (11010, 9999),
            (21010, 19999),
            (12010, 11999),
            (12110, 11999),
        ]:
            self.assertEqual(find_peters_last_number(arg), res)


def find_peters_last_number(number):
    place = 1
    pre = None
    for i in range(1, 10):
        place = 10**i
        if place > number:
            return number

        cur = (number // place) % 10
        pre = (number // (place // 10)) % 10

        if cur > pre:
            number -= (number % place) + 1

    return number


def main():
    try:
        number = int(sys.argv[1])
    except IndexError:
        print("Pass a number as arg to compute Peter's last number")
    else:
        print(find_peters_last_number(number))


if __name__ == "__main__":
    main()
