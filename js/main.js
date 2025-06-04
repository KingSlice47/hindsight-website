// --- Page Transition Functions ---
function animatePageOut() {
    return new Promise(resolve => {
        const pageContent = document.getElementById('page-content');
        if (pageContent) {
            pageContent.style.opacity = '0';
            setTimeout(() => {
                resolve();
            }, 300); // Matches CSS transition duration
        } else {
            console.error("#page-content not found for animatePageOut");
            resolve(); // Resolve immediately if no content to animate
        }
    });
}

async function fetchPage(url) {
    console.log(`fetchPage called for: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`Error fetching page: ${response.status} ${response.statusText}`);
            return null; // Or throw an error
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(`Network error or other issue fetching page: ${url}`, error);
        return null; // Or throw an error
    }
}

function animatePageIn() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.style.opacity = '0'; // Ensure it's hidden before fade-in
        // Force reflow and then animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                pageContent.style.opacity = '1';
            });
        });
        console.log("animatePageIn: Fade-in initiated.");
        // Note: Re-initialization of scripts for new content is handled by reinitializeGlobalScriptsAndListeners
    } else {
        console.error("#page-content not found for animatePageIn");
    }
}

// Function to re-initialize scripts and listeners on new content
function reinitializeGlobalScriptsAndListeners() {
    console.log("Re-initializing scripts and listeners...");

    // 1. Re-initialize Intersection Observer for .animate-on-scroll elements
    // Disconnect previous observers to avoid observing detached elements (optional, as innerHTML replacement removes them)
    // observer.disconnect(); // If we were not replacing innerHTML, this would be more important.
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });
    console.log("Intersection observers re-initialized for .animate-on-scroll elements.");

    // 2. Re-execute scripts within #page-content
    // This is necessary for scripts that attach event listeners, like form handlers.
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        const scripts = pageContent.querySelectorAll('script');
        scripts.forEach(oldScript => {
            const newScript = document.createElement('script');
            // Copy attributes
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });
            // Copy inline script content
            if (oldScript.textContent) {
                newScript.textContent = oldScript.textContent;
            }
            // Replace the old script tag with the new one to execute it
            oldScript.parentNode.replaceChild(newScript, oldScript);
            console.log("Re-executed script:", oldScript.src || "inline script");
        });
    }
    // Add any other global re-initialization logic here if needed in the future
}

function updateBrowserHistory(url, title) {
    console.log(`updateBrowserHistory called for: ${url} with title: ${title}`);
    history.pushState({ path: url }, title, url);
    document.title = title;
}

// --- Main Application Logic ---
document.addEventListener('DOMContentLoaded', function() {
    // Initial state for popstate
    history.replaceState({ path: window.location.href }, document.title, window.location.href);
    // Mobile Menu (Example of a script that might need re-initialization or careful handling)
    // For simplicity, this example assumes the mobile menu structure is NOT part of the content replaced by page transitions.
    // If it is, it would need to be re-initialized after content replacement.
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            // If a mobile menu link is an internal link handled by page transitions,
            // it will be handled by the global internalLinks listener.
            // This specific listener is just to close the menu.
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        document.addEventListener('click', function(event) {
            if (!mobileMenu.contains(event.target) && !mobileMenuButton.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Page Transition Link Handling
    async function handleLinkClick(event) {
        const link = event.currentTarget;
        const href = link.getAttribute('href');

        const linkUrl = new URL(href, window.location.origin);
        if (linkUrl.origin !== window.location.origin) {
            console.log("Link is external, allowing default navigation:", href);
            return;
        }

        event.preventDefault();
        console.log(`Internal link clicked: ${href}`);

        await animatePageOut();

        try {
            const htmlContent = await fetchPage(href);
            if (htmlContent) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const newPageContent = doc.getElementById('page-content');
                const currentPageContent = document.getElementById('page-content');

                if (newPageContent && currentPageContent) {
                    currentPageContent.innerHTML = newPageContent.innerHTML;
                    const newTitle = doc.querySelector('title') ? doc.querySelector('title').textContent : 'No Title';
                    updateBrowserHistory(href, newTitle);
                    animatePageIn();
                    reinitializeGlobalScriptsAndListeners(); // Re-run scripts for new content

                } else {
                    console.error("'page-content' div not found in current page or fetched HTML. Aborting content replacement.");
                    // Fallback to full page load if content structure is unexpected
                    window.location.href = href;
                }
            } else {
                console.log("No content fetched, navigation aborted. Consider full page load fallback.");
                // window.location.href = href; // Fallback for failed fetch
            }
        } catch (error) {
            console.error("Error during page fetch or processing in handleLinkClick:", error);
            // Fallback to full page load on error
            window.location.href = href;
        }
    }

    // Page Transition Link Handling (Initial Setup)
    // Event listeners for links loaded dynamically into #page-content will need to be re-attached.
    // This is covered by the "TODO: Re-initialize scripts..." in handleLinkClick and onpopstate.
    const internalLinks = document.querySelectorAll(
        'a[href]:not([href^="#"]):not([target="_blank"]):not([data-no-transition])'
    );
    internalLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });

    // Intersection Observer for fade-in animations
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
});

// Handle Back/Forward browser navigation
window.onpopstate = async function(event) {
    console.log("popstate event fired", event.state);
    if (event.state && event.state.path) {
        const path = event.state.path;

        await animatePageOut();

        try {
            const htmlContent = await fetchPage(path);
            if (htmlContent) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                const newPageContent = doc.getElementById('page-content');
                const currentPageContent = document.getElementById('page-content');

                if (newPageContent && currentPageContent) {
                    currentPageContent.innerHTML = newPageContent.innerHTML;
                    const newTitle = doc.querySelector('title') ? doc.querySelector('title').textContent : 'No Title';
                    document.title = newTitle;
                    animatePageIn();
                    reinitializeGlobalScriptsAndListeners(); // Re-run scripts for new content

                } else {
                    console.error("'page-content' div not found in current page or fetched HTML during popstate. Full reload fallback.");
                    window.location.href = path;
                }
            } else {
                console.error("Failed to fetch page content on popstate, redirecting...");
                window.location.href = path;
            }
        } catch (error) {
            console.error("Error during page fetch or processing in onpopstate:", error);
            window.location.href = path;
        }
    } else {
        // This might happen if the state is null (e.g., initial load or manual URL change not managed by pushState)
        // Or if event.state itself is null.
        // For robustness, you might want to reload the current page or handle appropriately.
        console.log("popstate event with no state.path, possibly initial load or manual hash change.");
        // window.location.reload(); // Could be too aggressive
    }
};

// Smooth scroll for anchor links
// This should ideally run after any dynamic content loading or be delegated if content is replaced.
// For now, it's attached on initial DOMContentLoaded. If a new page loads content with new anchors,
// this might need to be re-applied to those new anchors.
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// PayFast integration helper functions
// Ensure PayFast related buttons or links have 'data-no-transition' if they are <a> tags
function initializePayFastCheckout(serviceId, amount, description) {
    // This is a placeholder function that will be implemented when PayFast credentials are available
    // It will create and submit a form with the necessary PayFast parameters
    console.log(`Initializing PayFast checkout for service ${serviceId} with amount R${amount}`);
    
    // Example of how the PayFast integration will work:
    /*
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.payfast.co.za/eng/process';
    
    const params = {
        merchant_id: 'MERCHANT_ID',
        merchant_key: 'MERCHANT_KEY',
        return_url: 'https://www.hindsightonline.co.za/thank-you',
        cancel_url: 'https://www.hindsightonline.co.za/cart',
        notify_url: 'https://www.hindsightonline.co.za/api/payfast-callback',
        amount: amount,
        item_name: description,
    };

    Object.keys(params).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = params[key];
        form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
    */
}

// Add to cart functionality
let cart = [];

function addToCart(serviceId, name, price) {
    cart.push({ id: serviceId, name, price });
    updateCartUI();
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Note: The IntersectionObserver setup is within the main DOMContentLoaded.
// If elements with .animate-on-scroll are part of #page-content,
// the observer might need to be re-applied to new elements after content swap.
// The current "TODO" for re-initialization should cover this.

// The duplicate DOMContentLoaded and placeholder functions at the end of the file
// were from the erroneous file read in the previous turn. They are not in the correct file version.