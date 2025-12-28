import React from 'react';

/**
 * Lazy Loading Implementation for Lawyer Cards
 * Uses Intersection Observer API for optimal performance
 */

// Check for browser environment
const isBrowser = typeof window !== 'undefined';
const supportsIntersectionObserver = isBrowser && 'IntersectionObserver' in window;

export class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
      onLoad: () => {},
      onError: () => {},
      ...options
    };
    
    this.observer = null;
    this.observedElements = new Map();
    this.initObserver();
  }

  initObserver() {
    if (!supportsIntersectionObserver) {
      console.warn('IntersectionObserver not supported, falling back to eager loading');
      return;
    }

    const { root, rootMargin, threshold } = this.options;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadElement(entry.target);
          this.observer.unobserve(entry.target);
          this.observedElements.delete(entry.target);
        }
      });
    }, { root, rootMargin, threshold });
  }

  observe(element, loadCallback) {
    if (!this.observer) {
      loadCallback();
      return;
    }

    this.observedElements.set(element, loadCallback);
    this.observer.observe(element);
  }

  loadElement(element) {
    const loadCallback = this.observedElements.get(element);
    if (loadCallback) {
      try {
        loadCallback();
        this.options.onLoad(element);
      } catch (error) {
        console.error('Lazy load failed:', error);
        this.options.onError(element, error);
      }
    }
  }

  unobserve(element) {
    if (this.observer && this.observedElements.has(element)) {
      this.observer.unobserve(element);
      this.observedElements.delete(element);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.observedElements.clear();
    }
  }
}

/**
 * React Hook for lazy loading components
 */
export const useLazyLoad = (ref, options = {}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const optionsRef = React.useRef(options);
  
  React.useEffect(() => {
    if (!ref.current || !supportsIntersectionObserver) {
      setIsVisible(true); // Show immediately if no support
      return;
    }
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, optionsRef.current);
    
    const element = ref.current;
    observer.observe(element);
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, []); // No dependencies to avoid re-creating observer
  
  return isVisible;
};

/**
 * Higher Order Component for lazy loading
 */
export const withLazyLoad = (Component, placeholder = null) => {
  const LazyLoadedComponent = React.forwardRef((props, ref) => {
    const containerRef = React.useRef(null);
    const isVisible = useLazyLoad(containerRef);
    
    return (
      <div ref={containerRef} className="lazy-load-container">
        {isVisible ? <Component {...props} ref={ref} /> : placeholder}
      </div>
    );
  });

  LazyLoadedComponent.displayName = `withLazyLoad(${
    Component.displayName || Component.name || 'Component'
  })`;

  return LazyLoadedComponent;
};

/**
 * Utility to lazy load images
 */
const imageObservers = new WeakMap();

export const lazyLoadImage = (imgElement, src, srcset = '') => {
  if (!imgElement || !supportsIntersectionObserver) {
    // Load immediately if no support
    if (srcset) imgElement.srcset = srcset;
    if (src) imgElement.src = src;
    return () => {};
  }
  
  if (imageObservers.has(imgElement)) {
    return imageObservers.get(imgElement);
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        if (srcset) img.srcset = srcset;
        if (src) img.src = src;
        
        img.classList.add('loaded');
        observer.unobserve(img);
        imageObservers.delete(img);
      }
    });
  }, { rootMargin: '100px' });
  
  observer.observe(imgElement);
  
  const cleanup = () => {
    observer.disconnect();
    imageObservers.delete(imgElement);
  };
  
  imageObservers.set(imgElement, cleanup);
  return cleanup;
};

/**
 * Batch lazy loader for multiple items
 */
export class BatchLazyLoader {
  constructor(batchSize = 10, delay = 100) {
    this.batchSize = batchSize;
    this.delay = delay;
    this.queue = [];
    this.isProcessing = false;
  }

  add(item, loadCallback) {
    this.queue.push({ item, loadCallback });
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      while (this.queue.length > 0) {
        const batch = this.queue.splice(0, this.batchSize);
        
        // Process batch in parallel
        await Promise.all(
          batch.map(({ item, loadCallback }) => 
            Promise.resolve().then(() => loadCallback(item))
          )
        );
        
        if (this.queue.length > 0) {
          await new Promise(resolve => setTimeout(resolve, this.delay));
        }
      }
    } catch (error) {
      console.error('Batch processing failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  clear() {
    this.queue = [];
  }
}

/**
 * Preload critical resources
 */
export const preloadCriticalResources = (resources = []) => {
  if (!isBrowser) return;
  
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.match(/\.(woff2?|ttf|otf)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    } else if (resource.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
      link.as = 'image';
    } else if (resource.match(/\.(js|mjs)$/)) {
      link.as = 'script';
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Initialize lazy loading for the entire page
 */
export const initPageLazyLoading = () => {
  if (!isBrowser || !supportsIntersectionObserver) {
    return () => {};
  }
  
  // Lazy load images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });
  
  lazyImages.forEach(img => imageObserver.observe(img));
  
  // Lazy load background images
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  
  const bgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        element.style.backgroundImage = `url(${element.dataset.bg})`;
        element.classList.add('bg-loaded');
        bgObserver.unobserve(element);
      }
    });
  }, { rootMargin: '100px' });
  
  lazyBackgrounds.forEach(el => bgObserver.observe(el));
  
  // Return cleanup function
  return () => {
    imageObserver.disconnect();
    bgObserver.disconnect();
  };
};
