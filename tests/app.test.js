// Make a test for a dots array
describe('dots', function () {

    it('should return a length of 310', function () {
        let result = dots.length;
        expect(result).toBe(310);
    });
    it('dot should have radius of 3', function () {
        let result = dots[0].radius;
        expect(result).toBe(3);
    })
});

describe('ghosts', function () {

    it('should return length of 1', function () {
        let result = ghosts.length;
        expect(result).toBe(1);
    })
})

describe('map', function () {
    it('should return length of 27', function () {
        let result = map.length;
        expect(result).toBe(27);
    })
})

describe('pacman', function () {
    it('pacman should have yellow color', function () {
        let result = pacman.color;
        expect(result).toBe('yellow');
    })

    it('pacman2 should have pink color', function () {
        let result = pacman2.color;
        expect(result).toBe('pink');
    })

    it('pacman should have radius of 15', function () {
        let result = pacman.radius;
        expect(result).toBe(15);
    })

    it('pacman should start with 0 velocity for x', function () {
        let result = pacman.velocity.x;
        expect(result).toBe(0);
    })

    it('pacman should start with 0 velocity for y', function () {
        let result = pacman.velocity.y;
        expect(result).toBe(0);
    })
})

describe('score', function () {
    it('should return a number', function () {
        let result = score1;
        expect(typeof result).toBe('number');
    })
})