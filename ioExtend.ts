/**
 * IoExtend blocks
   */
//% weight=100 color=#0fbc11 icon=""
namespace IoExtend {
    const MCP23S17_CMD_WRITE = 0x40;
    const MCP23S17_CMD_READ = 0x41;

    const MCP23S17_IODIRA = 0x00;
    const MCP23S17_IODIRB = 0x01;
    const MCP23S17_GPIOA = 0x12;
    const MCP23S17_GPIOB = 0x13;
    const MCP23S17_IOCON = 0x0A;
    const MCP23S17_OLATA = 0x14;
    const MCP23S17_OLATB = 0x15;

    let _GPIOA:number = 0;
    let _GPIOB:number = 0;
    let _OLATA: number = 0;
    let _OLATB: number = 0;

    /**
     * Initialize LCD. Call at onece.
     */
    //% block
    export function init(): void {

        pins.digitalWritePin(DigitalPin.P2, 0)//reset
        basic.pause(1)
        pins.digitalWritePin(DigitalPin.P2, 1)
        pins.digitalWritePin(DigitalPin.P16,1)
        pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
        pins.spiFormat(8, 0)
        pins.spiFrequency(10000000)
        basic.pause(1)
        setDirPORTA(0x00);
        setDirPORTB(0x00);
    }

    /**
     * read pin 0-15
     * @param pin describe parameter here, eg: 5
     */
    //% block
    export function digitalRead(pin: number): number {
        if (pin < 8){
            let gpioa = _readRegister(MCP23S17_GPIOA);
            if ((gpioa & ( 1<< pin)) != 0){
                return 1;
            }else{
                return 0;
            }
        }else{
            let gpiob = _readRegister(MCP23S17_GPIOB);
            pin &= 0x07;
            if ((gpiob & (1 << pin)) != 0){
                return 1;
            }else{
                return 0;
            }
        }
    }

    /**
     * read pin 0-15
     * @param pin describe parameter here, eg: 5
     */
    //% block
    export function digitalWrite(pin: number,level:number): void {
        let register=0;
        let noshifts=0;
        let data = 0;

        if (pin < 8) {
            register = MCP23S17_GPIOA;
            data = _GPIOA;
            noshifts = pin;
        } else {
            register = MCP23S17_GPIOB;
            noshifts = pin & 0x07;
            data = _GPIOB;
        }
        if (level == 1){
            data |= 1 << noshifts;
        }else{
            data &= ~(1<<noshifts);
        }

        _writeRegister(register,data);

        if (pin < 0){
            _GPIOA = data;
        }else{
            _GPIOB = data;
        }
    }

    /**
     * read PORTA
     */
    //% block
    export function readPORTA(): number {
        let data = _readRegister(MCP23S17_GPIOA);
        _GPIOA = data;
        return data;
    }

    /**
     * read PORTB
     */
    //% block
    export function readPORTB(): number {
        let data = _readRegister(MCP23S17_GPIOB);
        _GPIOB = data;
        return data;
    }
    /**
     * read LatchA
     */
    //% block
    export function readLatchA(): number {
        let data = _readRegister(MCP23S17_OLATA);
        _OLATA = data;
        return data;
    }

    /**
     * read LatchB
     */
    //% block
    export function readLatchB(): number {
        let data = _readRegister(MCP23S17_OLATB);
        _OLATB = data;
        return data;
    }

    /**
     * write PORTA
     * @param data describe parameter here, eg: 0x01
     */
    //% block
    export function writePORTA(data: number): void {
        _writeRegister(MCP23S17_GPIOA, data);
        _GPIOA = data;
    }

    /**
     * write PORTB
     * @param data describe parameter here, eg: 0x01
     */
    //% block
    export function writePORTB(data: number): void {
        _writeRegister(MCP23S17_GPIOB, data);
        _GPIOB = data;
    }


    /**
     * set directon PORTA
     * @param data describe parameter here, eg: 0xF3
     */
    //% block
    function setDirPORTA(data: number): void {
        _writeRegister(MCP23S17_IODIRA, data);
    }

    /**
     * set directon PORTB
     * @param data describe parameter here, eg: 0xF0
     */
    //% block
    function setDirPORTB(data: number): void {
        _writeRegister(MCP23S17_IODIRB, data);
    }

    //% block
    function _writeRegister(register: number, value: number): void{
        let cmd = [MCP23S17_CMD_WRITE,register,value];
        pins.digitalWritePin(DigitalPin.P16, 0);
        cmd.forEach(function(s){
            pins.spiWrite(s);
        })
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    //% block
    function _readRegister(register: number): number {
        let cmd = [MCP23S17_CMD_READ, register, 0];
        let ret = [0,0,0];
        pins.digitalWritePin(DigitalPin.P16, 0);
        for (let k=0; k<3; k++) {
            ret[k]=pins.spiWrite(cmd[k]);
        }
        pins.digitalWritePin(DigitalPin.P16, 1);
        return ret[2];
    }
}
