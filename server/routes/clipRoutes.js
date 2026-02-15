const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const Clip = require('../models/Clip');

// Create a new clip
router.post('/create', async (req, res) => {
    try {
        const { content, expiryMinutes, password } = req.body;

        if (!content || content.length === 0) {
            return res.status(400).json({ error: 'Content is required' });
        }

        if (content.length > 50000) {
            return res.status(400).json({ error: 'Content too long (max 50,000 chars)' });
        }

        // Sanitize content (basic)
        const sanitizedContent = validator.escape(content);

        // Calculate expiry date
        const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);

        // Generate short ID
        const shortId = nanoid(6);

        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const newClip = new Clip({
            shortId,
            content: content, // We store original content but escape it on frontend or carefully handle it
            password: hashedPassword,
            expiresAt
        });

        console.log('Saving new clip to MongoDB...');
        await newClip.save();
        console.log('Clip saved successfully');

        res.status(201).json({
            shortId,
            expiresAt,
            url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/v/${shortId}`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get a clip by shortId
router.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;
        const { password } = req.query;

        const clip = await Clip.findOne({ shortId });

        if (!clip) {
            return res.status(404).json({ error: 'Clip not found or has expired' });
        }

        // Check password if required
        if (clip.password) {
            if (!password) {
                return res.status(401).json({ error: 'Password required', isPasswordProtected: true });
            }
            const isMatch = await bcrypt.compare(password, clip.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password', isPasswordProtected: true });
            }
        }

        res.json({
            content: clip.content,
            expiresAt: clip.expiresAt,
            createdAt: clip.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
