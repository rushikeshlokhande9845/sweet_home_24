// Performance monitoring and optimization utilities

// Basic performance monitoring
(function() {
    // Measure page load time
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
                console.log('DOM Content Loaded Time:', perfData.domContentLoadedEventEnd - perfData.fetchStart, 'ms');
            }
        }, 0);
    });

    // Log memory usage if available
    if ('memory' in performance) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                const memory = performance.memory;
                console.log('Memory Usage:');
                console.log('- Used:', Math.round(memory.usedJSHeapSize / 1048576), 'MB');
                console.log('- Total:', Math.round(memory.totalJSHeapSize / 1048576), 'MB');
                console.log('- Limit:', Math.round(memory.jsHeapSizeLimit / 1048576), 'MB');
            }, 5000); // Delay to allow app to settle
        });
    }

    // Track long tasks
    if ('PerformanceObserver' in window && 'LongTaskTiming' in window) {
        const longTasks = [];
        const observer = new PerformanceObserver(function(list) {
            list.getEntries().forEach(function(entry) {
                longTasks.push(entry);
                console.warn('Long task detected:', entry.duration, 'ms');
            });
        });
        observer.observe({entryTypes: ['longtask']});
    }

    // Utility function to measure function execution time
    window.measureFunction = function(fn, name) {
        return function() {
            const start = performance.now();
            const result = fn.apply(this, arguments);
            const end = performance.now();
            console.log(name + ' took ' + (end - start) + ' milliseconds.');
            return result;
        };
    };

    // Add performance marks for key events
    window.markPerformance = function(markName) {
        if ('mark' in performance) {
            performance.mark(markName);
        }
    };

    // Measure duration between two marks
    window.measurePerformance = function(startMark, endMark, measureName) {
        if ('measure' in performance) {
            try {
                performance.measure(measureName, startMark, endMark);
                const measures = performance.getEntriesByName(measureName);
                if (measures.length > 0) {
                    console.log(measureName + ':', measures[0].duration, 'milliseconds.');
                }
            } catch (e) {
                console.warn('Could not measure performance:', e.message);
            }
        }
    };

    // Resource timing
    window.getResourceTimings = function() {
        if ('getEntriesByType' in performance) {
            const resources = performance.getEntriesByType('resource');
            console.log('Resource Timings:');
            resources.forEach(function(resource) {
                console.log(resource.name, resource.duration.toFixed(2) + 'ms');
            });
        }
    };

    // Simple FPS counter for animation performance
    window.FPSCounter = function() {
        let lastTime = performance.now();
        let frameCount = 0;
        let fps = 0;
        
        function tick() {
            frameCount++;
            const now = performance.now();
            const delta = (now - lastTime) / 1000;
            if (delta >= 1) {
                fps = Math.round(frameCount / delta);
                frameCount = 0;
                lastTime = now;
            }
            requestAnimationFrame(tick);
        }
        
        tick();
        
        return {
            getFPS: function() {
                return fps;
            }
        };
    };

    console.log('Performance monitoring initialized.');
})();

// Image lazy loading optimization
document.addEventListener('DOMContentLoaded', function() {
    // If browser supports native lazy loading, use it
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(function(img) {
            // Images are automatically lazy-loaded
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }
});