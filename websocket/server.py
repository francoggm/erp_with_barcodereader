import asyncio
import websockets
import cv2

from utils import searchProductId
from pyzbar.pyzbar import decode

async def read_barcode(websocket, cap):
    productId = -1

    while True:
        _, img = cap.read()

        for barcode in decode(img):
            barcodeData = barcode.data.decode('utf-8')
            productId = searchProductId(barcodeData)
        
        if productId != -1:
            await websocket.send(productId)
            await asyncio.sleep(1)

            productId = -1
        
        cv2.imshow('Result', img)
        cv2.waitKey(1)
        await asyncio.sleep(0.01)

async def handler(websocket, path):
    running = False

    while True:
        try:
            data = await websocket.recv()
            print(data)

            if data == "0":
                running = True
                cap = cv2.VideoCapture(0)
                cap.set(3, 640)
                cap.set(4, 480)

                task = asyncio.create_task(read_barcode(websocket, cap))

            if data == "1" and running:
                cap.release()
                cv2.destroyAllWindows()
                task.cancel()

                running = False

        except websockets.ConnectionClosed:
            if running:
                cap.release()
                cv2.destroyAllWindows()
                task.cancel()

            print("Closing connection!")
            break

async def main():
    async with websockets.serve(handler, "localhost", 8000):
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())