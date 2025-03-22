# Stages

Tool for trippy animations.

![stages](https://res.cloudinary.com/barhamon/image/upload/v1742155451/header/stages.png)

## Usage

[Demo](https://barhamon.com/stages/?s=001N003.x_t1.01.51.5011.x4.zero5.width3.x_t3.x_t003.y_t1.07.2.001011.5011.y4.zero6.height3.y_t3.y_t024.line5.logic1.y3.one5.width007.r_width1.03.1003.100036.limits3.sub1.x7.r_width3.sum1.x7.r_width041.r8.limits_a8.limits_b055.logic3.lte7.r_width3.loo1.r1.x013.loo4.zero3.max4.time4.time004.time1.04.60004.6000003.max1.03.1503.150)

## Documentation.

Top left corner has 0,0 coordinates. X axis goes from left to right, Y axis goes from top to bottom.

There is two types of controls and factory to spawn them.

+ Value producers. Some of them are just values like [zero](#Built in value producers.) or
[one](#Built in value producers.). Some of them need other vales to produce values. For example, [math](#Math) needs
two other values to produce a value.
+ Outputs, are the ones that draw something on the screen. A [line](#Line) is an example of an output.

All changes are synced to the URL. That has two side effects:

+ Browser back/forth works like undo/redo
+ If you come up with a nice animation, you can embed it into anywhere just by URL.

!!
! meh
It does crush on division by zero or if connections form a loop. Browser back (undo) does fix the issue most of the
time.
!!

### Built in value producers.

- `zero`: 0
- `one`: 1
- `two`: 2
- `width`: width of the browser window
- `height`: height of the browser window
- `i` - In each frame, some amount of shapes will be drawn, this will be the serial number of the shape drawn.
- `now` - Time since animation start in milliseconds.

### Factory

The factory spawns any available control.

### Slider

Produces a value that can be changed by user in UI. Minimum slider resolution is `0.00001`, if `min` and `max` are
close enough to each other.

### Math

Produces a value that is a result of math operations.

- `sum` - adds two values
- `sub` - subtracts two values
- `mul` - multiplies two values
- `div` - divides two values
- `avg` - averages two values

In order to use screen real estate efficiently, [math](#Math) has two blocks `a` (top) and `b` (bottom). Each block has
`lhs` and `rhs` values and `mode` that specifies operation. Those two blocks produce two values with `_a` and `_b`
postfixes.

### Oscillator

Produces a value that oscillates between `min` and `max` in time specified by `raise` and `fall`.

All oscillators are synced to the same zero time.

`raise` and `fall` are in milliseconds.

### Random

Produces a random value between `min` and `max`

### Line output

Connects `vertices` amount of vertices by a straight line.

For each frame, it will read values from `vertices` and `sr` (sample rate) parameters. Then it will read values from
`x` and `y`, `vertices` amount of time, advancing `now` by `sr` and `i` by one.

### Logic

Produces a value that is a result of logic operation.

- `eq`: left hand equals right hand
- `neq`: left hand not equals right hand
- `gt`: left hand greater than right hand
- `lt`: left hand less than right hand
- `gte`: left hand greater than or equals right hand
- `lte`: left hand less than or equals right hand

If logic operation evaluates to true, value from `is_true` connector will be returned, otherwise value from `is_false`.
