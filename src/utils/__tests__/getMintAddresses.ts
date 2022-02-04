import { getMintAddresses } from '../getMintAddresses'


describe('getMintAddresses', () => {
    jest.setTimeout(300000);

    it('should get correct mint addresses', async () => {
        const candyMachineCreator = '7FaRYjVfAzUSyZA4rfaXbvnTWZCmTgyZF3BFcB1GRJTc'
        const mintAddresses = await getMintAddresses(candyMachineCreator);
        expect(mintAddresses).toContain('7fwBaWCzQb2Fc2coVfoHVcT4MxBesAHKXCiRvTKSTj15') // a mint from the collection
    })
})

