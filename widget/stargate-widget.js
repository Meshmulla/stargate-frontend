/**
 * Stargate Pay Now Widget
 * One-line install: <script src="https://your-domain/widget/stargate-widget.js" data-invoice-id="INV-123"></script>
 * Or programmatic: StargateWidget.mount(document.getElementById('pay-btn'), { invoiceId: 'INV-123' })
 */
(function (global) {
  var STYLES = [
    'display:inline-flex',
    'align-items:center',
    'gap:8px',
    'padding:10px 20px',
    'background:#6C5CE7',
    'color:#fff',
    'border:none',
    'border-radius:6px',
    'font-size:14px',
    'font-weight:600',
    'cursor:pointer',
    'text-decoration:none',
    'transition:background 0.15s',
  ].join(';');

  function getOrigin(opts) {
    return (opts && opts.origin) || (global.StargateWidgetConfig && global.StargateWidgetConfig.origin) || '';
  }

  function mount(el, opts) {
    if (!el || !opts || !opts.invoiceId) {
      console.error('[StargateWidget] mount() requires an element and opts.invoiceId');
      return;
    }
    var origin = getOrigin(opts);
    var label = opts.label || 'Pay Now';
    var url = origin + '/pay/' + encodeURIComponent(opts.invoiceId);

    var btn = document.createElement('a');
    btn.href = url;
    btn.target = opts.target || '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('style', STYLES);
    btn.setAttribute('aria-label', label);
    btn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>' +
      '<span>' + label + '</span>';

    btn.addEventListener('mouseover', function () { btn.style.background = '#1860A5'; });
    btn.addEventListener('mouseout', function () { btn.style.background = '#6C5CE7'; });

    el.innerHTML = '';
    el.appendChild(btn);
  }

  function autoMount() {
    var scripts = document.querySelectorAll('script[data-invoice-id]');
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      var invoiceId = script.getAttribute('data-invoice-id');
      var targetId = script.getAttribute('data-target');
      var target = targetId ? document.getElementById(targetId) : null;
      if (!target) {
        // inject a span right after the script tag
        target = document.createElement('span');
        script.parentNode.insertBefore(target, script.nextSibling);
      }
      mount(target, {
        invoiceId: invoiceId,
        label: script.getAttribute('data-label') || undefined,
        origin: script.getAttribute('data-origin') || undefined,
        target: script.getAttribute('data-link-target') || undefined,
      });
    }
  }

  global.StargateWidget = { mount: mount };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoMount);
  } else {
    autoMount();
  }
})(window);
