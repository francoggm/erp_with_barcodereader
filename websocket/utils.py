from barcode.writer import ImageWriter

def generateBarcode(productId):
    number = '789' + productId
    barcodeFormat = barcode.get_barcode_class('gs1_128')

    barcode = barcodeFormat(number, writer = ImageWriter())
    barcode.save("barcodes/barcode_" + productId)

def searchProductId(barcodeData):
    if barcodeData and len(barcodeData) == 7:
        productId = barcodeData[4:]
        return productId

    return -1
