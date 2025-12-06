/**
 * SEO Service - Gestión profesional de SEO
 * Implementa las mejores prácticas de Google
 */

import axios from 'axios';
import { API_URL } from '../config';

class SEOService {
    constructor() {
        this.api = axios.create({
            baseURL: API_URL,
            headers: { 'Content-Type': 'application/json' }
        });

        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('marco_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }

    /**
     * Obtiene configuración SEO global
     */
    async getGlobalSEO() {
        try {
            const response = await this.api.post('/api/bridge/query', {
                collection: 'seo_settings',
                where: { id: 'global' },
                limit: 1
            });

            return response.data.data?.[0] || this.getDefaultSEO();
        } catch (error) {
            console.error('Error loading SEO settings:', error);
            return this.getDefaultSEO();
        }
    }

    /**
     * Configuración SEO por defecto
     */
    getDefaultSEO() {
        return {
            id: 'global',
            siteName: 'Marco CMS',
            siteDescription: 'Sistema de gestión de contenidos potenciado por IA',
            siteUrl: window.location.origin,
            defaultImage: '/images/og-default.jpg',
            twitterHandle: '@marcocms',
            facebookAppId: '',
            googleAnalytics: '',
            googleSearchConsole: '',
            robots: {
                index: true,
                follow: true,
                imageIndex: true,
                archive: true
            },
            socialProfiles: {
                twitter: 'https://twitter.com/marcocms',
                facebook: 'https://facebook.com/marcocms',
                linkedin: 'https://linkedin.com/company/marcocms',
                github: 'https://github.com/marcocms'
            },
            organization: {
                name: 'Marco CMS',
                legalName: 'Marco CMS Inc.',
                url: window.location.origin,
                logo: '/logo.png',
                foundingDate: '2025',
                founders: ['GestasAI Team'],
                address: {
                    streetAddress: '',
                    addressLocality: '',
                    addressRegion: '',
                    postalCode: '',
                    addressCountry: 'ES'
                },
                contactPoint: {
                    telephone: '',
                    contactType: 'customer service',
                    email: 'contact@marcocms.com'
                }
            }
        };
    }

    /**
     * Guarda configuración SEO global
     */
    async saveGlobalSEO(settings) {
        try {
            const existing = await this.api.post('/api/bridge/query', {
                collection: 'seo_settings',
                where: { id: 'global' },
                limit: 1
            });

            if (existing.data.data?.length > 0) {
                await this.api.post('/api/bridge/update', {
                    collection: 'seo_settings',
                    where: { id: 'global' },
                    updates: {
                        ...settings,
                        updated_at: new Date().toISOString()
                    }
                });
            } else {
                await this.api.post('/api/bridge/insert', {
                    collection: 'seo_settings',
                    document: {
                        ...settings,
                        id: 'global',
                        created_at: new Date().toISOString()
                    }
                });
            }

            return true;
        } catch (error) {
            console.error('Error saving SEO settings:', error);
            throw error;
        }
    }

    /**
     * Genera sitemap.xml automáticamente
     */
    async generateSitemap() {
        try {
            // Obtener todas las páginas publicadas
            const pages = await this.api.post('/api/bridge/query', {
                collection: 'pages',
                where: { status: 'published' }
            });

            // Obtener todos los posts publicados
            const posts = await this.api.post('/api/bridge/query', {
                collection: 'posts',
                where: { status: 'published' }
            });

            const siteUrl = window.location.origin;
            const sitemap = this.buildSitemapXML(
                siteUrl,
                pages.data.data || [],
                posts.data.data || []
            );

            return sitemap;
        } catch (error) {
            console.error('Error generating sitemap:', error);
            throw error;
        }
    }

    /**
     * Construye el XML del sitemap
     */
    buildSitemapXML(siteUrl, pages, posts) {
        const urls = [];

        // Homepage
        urls.push({
            loc: siteUrl,
            lastmod: new Date().toISOString(),
            changefreq: 'daily',
            priority: '1.0'
        });

        // Páginas
        pages.forEach(page => {
            urls.push({
                loc: `${siteUrl}/${page.slug}`,
                lastmod: page.updated_at || page.created_at,
                changefreq: 'weekly',
                priority: '0.8'
            });
        });

        // Posts
        posts.forEach(post => {
            urls.push({
                loc: `${siteUrl}/blog/${post.slug}`,
                lastmod: post.updated_at || post.created_at,
                changefreq: 'monthly',
                priority: '0.6'
            });
        });

        // Generar XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        urls.forEach(url => {
            xml += '  <url>\n';
            xml += `    <loc>${url.loc}</loc>\n`;
            xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
            xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
            xml += `    <priority>${url.priority}</priority>\n`;
            xml += '  </url>\n';
        });

        xml += '</urlset>';

        return xml;
    }

    /**
     * Genera robots.txt
     */
    generateRobotsTxt(siteUrl) {
        return `# Robots.txt for Marco CMS
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/

Sitemap: ${siteUrl}/sitemap.xml

# Google-specific
User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# Bing-specific
User-agent: Bingbot
Allow: /
`;
    }

    /**
     * Analiza la estructura de headings de una página
     */
    analyzeHeadingStructure(content) {
        const headings = [];
        const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
        let match;

        while ((match = headingRegex.exec(content)) !== null) {
            headings.push({
                level: parseInt(match[1]),
                text: match[2].replace(/<[^>]*>/g, ''),
                position: match.index
            });
        }

        // Validar estructura
        const issues = [];

        // Debe haber exactamente un H1
        const h1Count = headings.filter(h => h.level === 1).length;
        if (h1Count === 0) {
            issues.push({
                type: 'error',
                message: 'Falta el H1 principal'
            });
        } else if (h1Count > 1) {
            issues.push({
                type: 'warning',
                message: `Hay ${h1Count} H1. Debe haber solo uno.`
            });
        }

        // Verificar jerarquía
        for (let i = 1; i < headings.length; i++) {
            const current = headings[i];
            const previous = headings[i - 1];

            if (current.level > previous.level + 1) {
                issues.push({
                    type: 'warning',
                    message: `Salto de jerarquía: H${previous.level} a H${current.level}`,
                    heading: current.text
                });
            }
        }

        return {
            headings,
            issues,
            isValid: issues.filter(i => i.type === 'error').length === 0
        };
    }

    /**
     * Genera Table of Contents automático
     */
    generateTOC(headings) {
        const toc = [];
        const stack = [];

        headings.forEach(heading => {
            const item = {
                level: heading.level,
                text: heading.text,
                id: this.slugify(heading.text),
                children: []
            };

            while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
                stack.pop();
            }

            if (stack.length === 0) {
                toc.push(item);
            } else {
                stack[stack.length - 1].children.push(item);
            }

            stack.push(item);
        });

        return toc;
    }

    /**
     * Convierte texto a slug
     */
    slugify(text) {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}

export const seoService = new SEOService();
