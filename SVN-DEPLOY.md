# Deploy FilterOrbit to WordPress.org SVN

**SVN URL:** https://plugins.svn.wordpress.org/filterorbit-product-filters  
**Public URL:** https://wordpress.org/plugins/filterorbit-product-filters  
**SVN username:** `sakibbd08` (case-sensitive)

Set your SVN password: https://profiles.wordpress.org/me/profile/edit/group/3/?screen=svn-password

---

## First-time setup

### 1. Build the plugin

```bash
cd /home/sakib/web/woosearch/wp-content/plugins/filter-orbit
npm run build:plugin
```

Output: `build/filterorbit-product-filters/`

### 2. Check out SVN (folder name: `filterorbit-product-filters`)

```bash
cd ~
svn checkout https://plugins.svn.wordpress.org/filterorbit-product-filters filterorbit-product-filters
cd filterorbit-product-filters
```

You should see:

```
~/filterorbit-product-filters/
├── trunk/     # Active plugin code (users install from tags, trunk is dev)
├── tags/      # Versioned releases (1.0.1, 1.0.2, …)
└── assets/    # Icons, banners, screenshots for wordpress.org
```

### 3. Copy built files into `trunk/`

```bash
cp -r /home/sakib/web/woosearch/wp-content/plugins/filter-orbit/build/filterorbit-product-filters/* ~/filterorbit-product-filters/trunk/
```

`trunk/` must contain directly:

- `filterorbit-product-filters.php`
- `readme.txt`
- `uninstall.php`
- `includes/`
- `assets/`

### 4. Commit to trunk

```bash
cd ~/filterorbit-product-filters
svn add --force trunk/*
svn status
svn commit -m "Initial release 1.0.1"
```

### 5. Tag the release

Version in `readme.txt` (`Stable tag:`) and `filterorbit-product-filters.php` must match the tag folder name.

```bash
cd ~/filterorbit-product-filters
svn copy trunk tags/1.0.1
svn commit -m "Tag version 1.0.1"
```

### 6. Plugin assets (optional)

Add to `assets/`:

| File | Size |
|------|------|
| `icon-128x128.png` | 128×128 |
| `icon-256x256.png` | 256×256 |
| `banner-772x250.png` | 772×250 |
| `banner-1544x500.png` | 1544×500 |
| `screenshot-1.png` | screenshots for readme |

```bash
cd ~/filterorbit-product-filters
svn add assets/*
svn commit -m "Add plugin assets"
```

---

## Release updates (1.0.2, 1.0.3, …)

1. Bump `Version` in `filterorbit-product-filters.php`
2. Bump `Stable tag` in `readme.txt`
3. Rebuild:

```bash
cd /home/sakib/web/woosearch/wp-content/plugins/filter-orbit
npm run build:plugin
```

4. Copy to trunk and commit:

```bash
cp -r /home/sakib/web/woosearch/wp-content/plugins/filter-orbit/build/filterorbit-product-filters/* ~/filterorbit-product-filters/trunk/
cd ~/filterorbit-product-filters
svn commit -m "Update to 1.0.2"
```

5. Tag:

```bash
cd ~/filterorbit-product-filters
svn copy trunk tags/1.0.2
svn commit -m "Tag version 1.0.2"
```

---

## Useful SVN commands

```bash
cd ~/filterorbit-product-filters
svn update          # Pull latest from WordPress.org
svn status          # See local changes
svn diff            # Review changes before commit
svn revert -R .     # Discard local changes (careful)
```

---

## Links

- [How to use Subversion](https://developer.wordpress.org/plugins/wordpress-org/how-to-use-subversion/)
- [SVN password](https://make.wordpress.org/meta/handbook/tutorials-guides/svn-access/)
- [readme.txt validator](https://wordpress.org/plugins/developers/readme-validator/)
- [Plugin assets](https://developer.wordpress.org/plugins/wordpress-org/plugin-assets/)
