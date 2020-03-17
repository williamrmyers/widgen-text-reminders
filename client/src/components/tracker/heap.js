(window.heap = window.heap || []),
  (window.heap.load = function(e, t) {
    (window.heap.appid = e), (window.heap.config = t = t || {});
    var r = document.createElement("script");
    (r.type = "text/javascript"),
      (r.async = !0),
      (r.src = "https://cdn.heapanalytics.com/js/heap-" + e + ".js");
    var a = document.getElementsByTagName("script")[0];
    a.parentNode.insertBefore(r, a);
    for (
      var n = function(e) {
          return function() {
            window.heap.push(
              [e].concat(Array.prototype.slice.call(arguments, 0))
            );
          };
        },
        p = [
          "addEventProperties",
          "addUserProperties",
          "clearEventProperties",
          "identify",
          "resetIdentity",
          "removeEventProperty",
          "setEventProperties",
          "track",
          "unsetEventProperty"
        ],
        o = 0;
      o < p.length;
      o++
    )
      window.heap[p[o]] = n(p[o]);
  });
window.heap.load("4128452236");
// Tracking Snippet
