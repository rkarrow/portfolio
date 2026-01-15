# How to Add Your Images to the Hero Slider

## Quick Setup

1. **Add your images** to the `/client/public/images/` folder:
   - `slide1.jpg` - Creative Design project
   - `slide2.jpg` - Web Development project
   - `slide3.jpg` - UI/UX Design project
   - `slide4.jpg` - Mobile Apps project

2. **Image specifications:**
   - Recommended size: 1200x600px
   - Formats: JPG, PNG, WebP
   - Quality: Optimized for web (keep under 500KB each)

## Customizing the Slider

Edit `/src/components/HeroSection.js` and modify the `slides` array:

```javascript
const [slides] = useState([
  {
    id: 1,
    title: 'Your Title Here',
    image: '/images/slide1.jpg',
    description: 'Your description'
  },
  // ... more slides
]);
```

## Adding More Slides

Simply add more objects to the slides array:

```javascript
{
  id: 5,
  title: 'New Project',
  image: '/images/slide5.jpg',
  description: 'Amazing description'
}
```

## Features

✅ Auto-rotating carousel (changes every 5 seconds)
✅ Manual navigation with arrow buttons
✅ Clickable dot pagination
✅ Smooth transitions
✅ Mobile responsive
✅ Fallback image if file not found
✅ Beautiful gradient overlay with text

## Supported Image Types

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

## Tips

- Use high-quality images for best results
- Keep images landscape (wider than tall)
- Optimize images before uploading to reduce file size
- Use descriptive titles and descriptions
- Test on mobile devices for responsiveness
