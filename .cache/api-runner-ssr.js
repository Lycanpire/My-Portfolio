var plugins = [{
      name: 'gatsby-plugin-react-helmet',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-react-helmet/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-styled-components',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-styled-components/gatsby-ssr.js'),
      options: {"plugins":[],"displayName":true,"fileName":true,"minify":true,"namespace":"","transpileTemplateLiterals":true,"topLevelImportPaths":[],"pure":false,"disableVendorPrefixes":false},
    },{
      name: 'gatsby-plugin-image',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-image/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-sitemap',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-sitemap/gatsby-ssr.js'),
      options: {"plugins":[],"output":"/","createLinkInHead":true,"entryLimit":45000,"query":"{ site { siteMetadata { siteUrl } } allSitePage { nodes { path } } }","excludes":[]},
    },{
      name: 'gatsby-plugin-manifest',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-manifest/gatsby-ssr.js'),
      options: {"plugins":[],"name":"Syed Akbar Abbas Jafri","short_name":"Akbar","start_url":"/","background_color":"#020c1b","theme_color":"#0a192f","display":"minimal-ui","icon":"src/images/logo.png","legacy":true,"theme_color_in_head":true,"cache_busting_mode":"query","crossOrigin":"anonymous","include_favicon":true,"cacheDigest":"82b27089a4eb21f04ccd07e8504510df"},
    },{
      name: 'gatsby-plugin-offline',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-offline/gatsby-ssr.js'),
      options: {"plugins":[]},
    },{
      name: 'gatsby-plugin-google-analytics',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby-plugin-google-analytics/gatsby-ssr.js'),
      options: {"plugins":[],"trackingId":"G-XXXXXXXXXX","head":true,"anonymize":true,"respectDNT":true,"pageTransitionDelay":0,"enableWebVitalsTracking":true,"exclude":[]},
    },{
      name: 'partytown',
      plugin: require('/Users/Akbar/Desktop/SAAS dev/My-Portfolio/node_modules/gatsby/dist/internal-plugins/partytown/gatsby-ssr.js'),
      options: {"plugins":[]},
    }]
/* global plugins */
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

function augmentErrorWithPlugin(plugin, err) {
  if (plugin.name !== `default-site-plugin`) {
    // default-site-plugin is user code and will print proper stack trace,
    // so no point in annotating error message pointing out which plugin is root of the problem
    err.message += ` (from plugin: ${plugin.name})`
  }

  throw err
}

export function apiRunner(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  plugins.forEach(plugin => {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      return
    }

    try {
      const result = apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  })

  return results.length ? results : [defaultReturn]
}

export async function apiRunnerAsync(api, args, defaultReturn, argTransform) {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  const results = []
  for (const plugin of plugins) {
    const apiFn = plugin.plugin[api]
    if (!apiFn) {
      continue
    }

    try {
      const result = await apiFn(args, plugin.options)

      if (result && argTransform) {
        args = argTransform({ args, result })
      }

      // This if case keeps behaviour as before, we should allow undefined here as the api is defined
      // TODO V4
      if (typeof result !== `undefined`) {
        results.push(result)
      }
    } catch (e) {
      augmentErrorWithPlugin(plugin, e)
    }
  }

  return results.length ? results : [defaultReturn]
}
