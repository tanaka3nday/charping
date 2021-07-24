IoExtend.init()
basic.forever(function () {
    IoExtend.writePORTA(85)
    IoExtend.writePORTB(85)
    basic.pause(500)
    IoExtend.writePORTA(170)
    IoExtend.writePORTB(170)
    basic.pause(500)
})
