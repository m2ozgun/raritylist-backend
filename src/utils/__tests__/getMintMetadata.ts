import { getMintUri, getMintMetadata } from '../getMintMetadata'


describe('getMintMetadata', () => {
    it('should get correct mint uri', async () => {
        const mintAddress = '7fwBaWCzQb2Fc2coVfoHVcT4MxBesAHKXCiRvTKSTj15' // a mint from the collection

        const mintUri = await getMintUri(mintAddress);

        expect(mintUri).toEqual('https://arweave.net/UcBvaSC1u57RqQXVieJrwq55mAZVjYBzSVYIcDbzSwg')
    })

    it('should get correct mint attributes', async () => {
        const mintAddress = '7fwBaWCzQb2Fc2coVfoHVcT4MxBesAHKXCiRvTKSTj15' // a mint from the collection
        const mintMetadata = await getMintMetadata(mintAddress);

        const attributes = [
            { trait_type: 'Background', value: 'Dark green' },
            { trait_type: 'Weapon', value: 'sword' },
            { trait_type: 'Armor', value: 'Shirtless Armour' },
            { trait_type: 'Skin', value: 'Tan skin' },
            { trait_type: 'Facial Paint', value: 'No Attribute' },
            { trait_type: 'Facial Hair', value: 'Beard' },
            { trait_type: 'Head', value: 'Regular helmet' }
        ]
        expect(mintMetadata.attributes).toEqual(attributes)
        expect(mintMetadata.image).toEqual('https://arweave.net/j8BSSKQlevvLny4BUnYw8dNlOCWKbSuyvfkiiB5MUsw')

    })
})