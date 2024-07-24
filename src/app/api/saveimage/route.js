import { NextResponse } from 'next/server';
import prisma from '../../util/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed', status: false });
    }

    try {
        const { images } = req.body;

        if (!images || images.length === 0) {
            throw new Error('No images provided');
        }

        const createdImages = await prisma.image.createMany({
            data: images.map(img => ({
                url: img.url,
                type: img.type
            }))
        });

        return res.status(200).json({
            status: true,
            message: 'Images saved successfully',
            data: createdImages
        });
    } catch (error) {
        console.error('Error saving images:', error);
        return res.status(500).json({
            message: 'Failed to save images',
            status: false,
            error: error.message
        });
    }
}
