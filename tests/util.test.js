import Util from 'Helpers/util';

describe("Util", function() {
	test('returns key', () => {
		expect(Util.getKey({x: 6, y: 4})).toBe('6_4');
	});

	test('returns coordinates', () => {
		const coord = Util.getCoordinates('6_4');
		expect(coord[0]).toBe(6);
		expect(coord[1]).toBe(4);
	});
});