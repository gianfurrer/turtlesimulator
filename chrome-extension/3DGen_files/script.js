/**
	Geoservant 3D by Kai Noack
	https://www.matheretter.de/geoservant/en/

	This program is free software; you can redistribute it and/or modify it under the terms of the GNU General Public License
	as published by the Free Software Foundation; version 3 (GPLv3).
	This program is distributed in the hope that it will be useful,	but WITHOUT ANY WARRANTY; without even the implied warranty of
	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	More about this license: https://www.gnu.org/licenses/gpl.html

	License rights:
	- The source code must be made public whenever a distribution of the software is made.
	- The copyright notice must remain unchanged in the file.
	- Modifications of the software must be released under the same license.
	- Changes made to the source code must be documented.
**/

function nthroot(e, a) {
    try {
        var t = a % 2 == 1 && e < 0;
        t && (e = -e);
        var i = Math.pow(e, 1 / a);
        if (a = Math.pow(i, a),
        Math.abs(e - a) < 1 && e > 0 == a > 0)
            return t ? -i : i
    } catch (e) {}
}
function toRadians(e) {
    return e * (Math.PI / 180)
}
function toDegrees(e) {
    return e * (180 / Math.PI)
}
function parseFloatAndConst(e) {
    return parseFloat(String(e).replace(/pi/g, "3.14159").replace(/e/g, "2.71828"))
}
function getUrlParameters() {
    var e = {};
    window.location.href.replace(/[?&]+([^=&]+)=?([^&]*)/gi, function(a, t, i) {
        e[t] = i
    });
    return e
}
$(document).ready(function() {
    function e(e) {
        return e = Math.round(e * v) / v,
        String(e).replace(/\./g, ",")
    }
    function a() {
        var e = !1;
        if ($(".formelblock input").each(function() {
            $(this).val().indexOf(",") + 1 == $(this).val().length && (e = !0)
        }),
        e)
            return !0
    }
    function t() {
        var e = ""
          , a = $("textarea[name=val_drawings]").val().replace(/,/g, ".");
        e += "draw=" + (a = (a = encodeURIComponent(a.trim().replace(/\+/g, "&plus;")).replace(/%0A/g, "+")).replace(/\++/g, "+"));
        var t = location.protocol + "//" + location.host + location.pathname;
        t = t.replace(/\/$/, "") + "/",
        b || (e += "&axesoff"),
        _ = t + "?" + e,
        $("#memvaluelink").attr("href", _),
        $("#perspectiveviewbtn").attr("href", "/rechner/schragbild/?" + e)
    }
    function i() {
        N = {
            font: O,
            size: .3,
            height: .05,
            curveSegments: 2,
            weight: "normal",
            style: "normal"
        };
        var e = new THREE.TextGeometry("x",N)
          , a = new THREE.MeshBasicMaterial({
            color: 5614080
        });
        (K = new THREE.Mesh(e,a)).position.z = D + .1,
        K.position.y = .1,
        L.add(K);
        var t = new THREE.TextGeometry("y",N)
          , i = new THREE.MeshBasicMaterial({
            color: 255
        });
        (j = new THREE.Mesh(t,i)).position.x = D + .1,
        j.position.y = .1,
        j.rotation.y = 0,
        L.add(j);
        var n = new THREE.TextGeometry("z",N)
          , r = new THREE.MeshBasicMaterial({
            color: 16711680
        });
        (W = new THREE.Mesh(n,r)).position.y = D + .1,
        W.rotation.y = 0,
        L.add(W)
    }
    function n() {
        $("#additionals").empty();
        var e = $("textarea[name=val_drawings]").val();
        if (e.indexOf("$") > -1) {
            var a = {}
              , t = e.replace(/,/g, ".").split("\n")
              , i = 0
              , n = [];
            $.each(t, function() {
                var e = this.trim()
                  , t = ""
                  , r = "";
                if (0 == (e = e.replace(/ *(=) */g, "$1")).indexOf("$") && e.indexOf("=") > -1) {
                    var s = e.indexOf("=");
                    t = e.substring(1, s),
                    r = e.substring(s + 1, e.length),
                    console.log("Variable found in line " + i + ". Name: " + t + " | Content: " + r),
                    n.push(i),
                    a[t] = r
                }
                i++
            });
            s = e.split("\n");
            $.each(n, function() {
                s[this] = ""
            }),
            e = s.join("\n"),
            e = e.replace(/(^[ \t]*\n)/gm, ""),
            $.each(a, function(a, t) {
                var i = "\\$" + a
                  , n = new RegExp(i,"g");
                e = e.replace(n, t)
            })
        }
        var s = e.replace(/,/g, ".").split("\n");
        L.remove(z),
        z = new THREE.Object3D,
        V = 0,
        $.each(s, function() {
            r(this.toString())
        }),
        x && $.each(z.children, function(e, a) {
            a.castShadow = !0
        }),
        L.add(z)
    }
    function r(a) {
        L.background = x ? new THREE.Color(11184810) : new THREE.Color(16777215);
        var t = a.substring(0, a.indexOf("(")).trim()
          , i = a.substring(a.indexOf("(") + 1, a.lastIndexOf(")")).trim()
          , n = a.substring(a.indexOf("[") + 1, a.lastIndexOf("]"))
          , r = (M.length,
        "#111")
          , s = !1;
        m = y;
        for (var l, o = [], p = /\{(.*?)\}/g; null != (l = p.exec(a)); )
            o.push(l[1]);
        for (P = 0; P < o.length; P++) {
            var c = o[P];
            1 == c.length || c.indexOf(".") > -1 ? m = parseFloat(c) : 3 != c.length && 6 != c.length || (s = !0,
            r = "#" + c)
        }
        if (s || void 0 === F[V] || (r = F[V]),
        t != l_coordplanes && "text" != t && (V > 0 && $("#additionals").append("<br />"),
        "" != t && $("#additionals").append(t.charAt(0).toUpperCase() + t.slice(1) + ": ")),
        if (t == l_cube) {
            var w = i.replace(/\|/g, " ").split(" ")
              , ct = parseFloat(w[3])
              , ht = new THREE.MeshBasicMaterial({
                color: r,
                opacity: m,
                transparent: !0
            });
            x && (ht = new THREE.MeshPhongMaterial({
                color: r,
                specular: R,
                shininess: g,
                transparent: !0,
                opacity: m
            }));
            var Et = new THREE.Mesh(new THREE.CubeGeometry(ct,ct,ct),ht);
            Et.position.x = parseFloat(w[1]) + parseFloat(w[3] / 2),
            Et.position.y = parseFloat(w[2]) + parseFloat(w[3] / 2),
            Et.position.z = parseFloat(w[0]) + parseFloat(w[3] / 2);
            var dt = new THREE.Mesh(new THREE.SphereGeometry(.02,.02,.02),new THREE.MeshBasicMaterial({
                color: 85
            }));
            dt.position.x = Et.position.x,
            dt.position.y = Et.position.y,
            dt.position.z = Et.position.z,
            z.add(dt);
            var wa = new THREE.EdgesGeometry(Et.geometry)
              , va = new THREE.LineBasicMaterial({
                color: 10066329,
                linewidth: 1
            })
              , ya = new THREE.LineSegments(wa,va);
            Et.add(ya);
            var _t = Math.sqrt(2) * ct
              , ut = Math.sqrt(3) * ct
              , wt = 4 * ct
              , vt = ct * ct
              , yt = 4 * ct * ct
              , mt = 6 * ct * ct
              , bt = ct * ct * ct
              , xt = 12 * ct;
            if ($("#additionals").append('<span title="' + l_cube_edge + '">a = ' + e(ct) + '</span> &ensp;<span title="' + l_cube_areadiagonal + '">d = ' + e(_t) + '</span> &ensp;<span title="' + l_cube_spacediagonal + '">e = ' + e(ut) + '</span> &ensp;<span title="' + l_cube_perimeter + '">u = ' + e(wt) + '</span> &ensp;<span title="' + l_cube_basearea + '">' + l_basearea_abbr + " = " + e(vt) + '</span> &ensp;<span title="' + l_cube_lateralsurface + '">' + l_lateralsurface_abbr + " = " + e(yt) + '</span> &ensp;<span title="' + l_cube_surface + '">' + l_surface_abbr + " = " + e(mt) + '</span> &ensp;<span title="' + l_cube_volume + '">' + l_volume_abbr + " = " + e(bt) + '</span> &ensp;<span title="' + l_cube_lengthsides + '">' + l_length_abbr + " = " + e(xt) + "</span> &ensp;"),
            n.length > 0) {
                qt = n.replace(/\|/g, " ").split(" ");
                Et.rotation.x = Math.PI * parseFloat(qt[1]) / 180,
                Et.rotation.y = Math.PI * parseFloat(qt[2]) / 180,
                Et.rotation.z = Math.PI * parseFloat(qt[0]) / 180
            }
            z.add(Et),
            V++
        }
        X.visible = Y.visible = Z.visible = b
    }
    function s() {}
    function l() {
        !u && w || (w = !0,
        s(),
        setTimeout(function() {
            requestAnimationFrame(l)
        }, 25),
        C.update(),
        G.render(L, A))
    }
    function o(e) {
        e && !u ? (u = !0,
        l()) : !e && u && (u = !1)
    }
    function p(e) {
        setTimeout(function() {
            o(!1)
        }, e)
    }
    function c() {
        B = document.getElementById("rendercanvas").offsetWidth,
        q = document.getElementById("rendercanvas").offsetHeight,
        A.aspect = B / q,
        A.updateProjectionMatrix(),
        G.setSize(B, q),
        l()
    }
    function h() {
        A.aspect = window.innerWidth / window.innerHeight,
        A.updateProjectionMatrix(),
        G.setSize(window.innerWidth, window.innerHeight),
        l()
    }
    function E(e, a, t) {
        if (e.createTextRange) {
            var i = e.createTextRange();
            i.collapse(!0),
            i.moveStart("character", a),
            i.moveEnd("character", t),
            i.select()
        } else
            e.setSelectionRange ? e.setSelectionRange(a, t) : e.selectionStart && (e.selectionStart = a,
            e.selectionEnd = t)
    }
    function d(e, a) {
        var t = new THREE.Vector3(e.y,e.z,e.x)
          , i = new THREE.Vector3(a.y,a.z,a.x)
          , n = (new THREE.Vector3).subVectors(i, t).normalize()
          , r = Math.sqrt(Math.pow(a.y - e.y, 2) + Math.pow(a.z - e.z, 2) + Math.pow(a.x - e.x, 2))
          , s = new THREE.ArrowHelper(n,t,r,1127253);
        return s.setLength(r, .5, .25),
        s
    }
    window.location.href;
    $("#meta-siteurl").text(),
    l_coordplanes = $("#meta-l_coordplanes").html(),
    l_triangle = $("#meta-l_triangle").html(),
    l_plane = $("#meta-l_plane").html(),
    l_line = $("#meta-l_line").html(),
    l_sphere = $("#meta-l_sphere").html(),
    l_polygon = $("#meta-l_polygon").html(),
    l_point = $("#meta-l_point").html(),
    l_cuboid = $("#meta-l_cuboid").html(),
    l_parallelepiped = $("#meta-l_parallelepiped").html(),
    l_lineseg = $("#meta-l_lineseg").html(),
    l_text = $("#meta-l_text").html(),
    l_vector = $("#meta-l_vector").html(),
    l_vector_dt = $("#meta-l_vector_dt").html(),
    l_vectorlength = $("#meta-l_vectorlength").html(),
    l_quadrangle = $("#meta-l_quadrangle").html(),
    l_cube = $("#meta-l_cube").html(),
    l_cylinder = $("#meta-l_cylinder").html(),
    l_width = $("#meta-l_width").html(),
    l_width_abbr = $("#meta-l_width_abbr").html(),
    l_length = $("#meta-l_length").html(),
    l_length_abbr = $("#meta-l_length_abbr").html(),
    l_height = $("#meta-l_height").html(),
    l_height_abbr = $("#meta-l_height_abbr").html(),
    l_radius = $("#meta-l_radius").html(),
    l_radius_abbr = $("#meta-l_radius_abbr").html(),
    l_diameter = $("#meta-l_diameter").html(),
    l_diameter_abbr = $("#meta-l_diameter_abbr").html(),
    l_perimeter = $("#meta-l_perimeter").html(),
    l_perimeter_abbr = $("#meta-l_perimeter_abbr").html(),
    l_basearea = $("#meta-l_basearea").html(),
    l_basearea_abbr = $("#meta-l_basearea_abbr").html(),
    l_lateralsurface = $("#meta-l_lateralsurface").html(),
    l_lateralsurface_abbr = $("#meta-l_lateralsurface_abbr").html(),
    l_surface = $("#meta-l_surface").html(),
    l_surface_abbr = $("#meta-l_surface_abbr").html(),
    l_volume = $("#meta-l_volume").html(),
    l_volume_abbr = $("#meta-l_volume_abbr").html(),
    l_edgelength_abbr = $("#meta-l_edgelength_abbr").html(),
    l_triangle_sidelength = $("#meta-l_triangle_sidelength").html(),
    l_conn_vectors = $("#meta-l_conn_vectors").html(),
    l_area = $("#meta-l_area").html(),
    l_plane_pf = $("#meta-l_plane_pf").html(),
    l_plane_pf_abbr = $("#meta-l_plane_pf_abbr").html(),
    l_plane_cf = $("#meta-l_plane_cf").html(),
    l_plane_cf_abbr = $("#meta-l_plane_cf_abbr").html(),
    l_line_pf = $("#meta-l_line_pf").html(),
    l_line_pf_abbr = $("#meta-l_line_pf_abbr").html(),
    l_line_trackpoints = $("#meta-l_line_trackpoints").html(),
    l_line_trackpoints_abbr = $("#meta-l_line_trackpoints_abbr").html(),
    l_sphere_radius = $("#meta-l_sphere_radius").html(),
    l_sphere_perimeter = $("#meta-l_sphere_perimeter").html(),
    l_sphere_area = $("#meta-l_sphere_area").html(),
    l_sphere_area_abbr = $("#meta-l_sphere_area_abbr").html(),
    l_sphere_surface = $("#meta-l_sphere_surface").html(),
    l_sphere_volume = $("#meta-l_sphere_volume").html(),
    l_sphere_equation = $("#meta-l_sphere_equation").html(),
    l_cuboid_edges = $("#meta-l_cuboid_edges").html(),
    l_cuboid_diagonal = $("#meta-l_cuboid_diagonal").html(),
    l_cuboid_perimeter = $("#meta-l_cuboid_perimeter").html(),
    l_cuboid_basearea = $("#meta-l_cuboid_basearea").html(),
    l_cuboid_lateralsurface = $("#meta-l_cuboid_lateralsurface").html(),
    l_cuboid_surface = $("#meta-l_cuboid_surface").html(),
    l_cuboid_volume = $("#meta-l_cuboid_volume").html(),
    l_cuboid_edgeslength = $("#meta-l_cuboid_edgeslength").html(),
    l_vectors_length = $("#meta-l_vectors_length").html(),
    l_lineseg_length = $("#meta-l_lineseg_length").html(),
    l_lineseg_length_abbr = $("#meta-l_lineseg_length_abbr").html(),
    l_lineseg_asvec = $("#meta-l_lineseg_asvec").html(),
    l_vector_anglexy = $("#meta-l_vector_anglexy").html(),
    l_quadrangle_length = $("#meta-l_quadrangle_length").html(),
    l_cube_edge = $("#meta-l_cube_edge").html(),
    l_cube_areadiagonal = $("#meta-l_cube_areadiagonal").html(),
    l_cube_spacediagonal = $("#meta-l_cube_spacediagonal").html(),
    l_cube_perimeter = $("#meta-l_cube_perimeter").html(),
    l_cube_basearea = $("#meta-l_cube_basearea").html(),
    l_cube_lateralsurface = $("#meta-l_cube_lateralsurface").html(),
    l_cube_surface = $("#meta-l_cube_surface").html(),
    l_cube_volume = $("#meta-l_cube_volume").html(),
    l_cube_lengthsides = $("#meta-l_cube_lengthsides").html(),
    l_cylinder_diameter = $("#meta-l_cylinder_diameter").html(),
    l_cylinder_perimeter = $("#meta-l_cylinder_perimeter").html(),
    l_cylinder_basearea = $("#meta-l_cylinder_basearea").html(),
    l_cylinder_lateralsurface = $("#meta-l_cylinder_lateralsurface").html(),
    l_cylinder_surface = $("#meta-l_cylinder_surface").html(),
    l_cylinder_volume = $("#meta-l_cylinder_volume").html();
    var _, u = !1, w = !1, v = Math.pow(10, 3), y = parseFloat($("input#val_alpha").val()), m = y, b = !0, x = !1, H = !1, g = 10, T = 5, R = 5592405, f = 1118481, z = new THREE.Object3D, M = [], F = ["#00F", "#0A0", "#F00", "#C0C", "#0A0", "#FA0", "#00F0F0", "#A00A0A", "#FF0F00", "#5599FF", "#CCC0CC", "#A509AF", "#0FAFAA"], V = 0, P = (new THREE.Object3D,
    ""), S = "", I = (window.location.href,
    getUrlParameters());
    if (Object.keys(I).length > 0) {
        var k = decodeURIComponent(I.draw).replace(/\+/g, "\n").replace(/\&plus\;/g, "+");
        $("textarea[name=val_drawings]").val(k),
        void 0 !== I.axesoff && (console.log("axes off"),
        b = !1,
        $("#axes-visible").prop("checked", !1))
    }
    $(".formelblock").keyup(function(e) {
        if (o(!1),
        !a() && 37 != e.keyCode && 39 != e.keyCode && 38 != e.keyCode && 40 != e.keyCode) {
            $("#errormsg").html("");
            var i = $("textarea[name=val_drawings]").val();
            i != P && (P = i,
            t(),
            n(),
            A.lookAt(z.position),
            o(!0),
            p(100),
            "" == $("#additionals").text() ? $("#additionals").hide() : ($("#additionals span").tipsy({
                gravity: "s",
                offset: 5,
                html: !0
            }),
            $("#additionals").show()))
        }
    }),
    $("textarea#val_drawings").focusin(function(e) {
        C.noPan = !0
    }).focusout(function(e) {
        C.noPan = !1
    }),
    $(document).keyup(function(e) {
        me && 27 === e.keyCode && $("#fullscreenbtn-close").trigger("click")
    }),
    $("#rendercanvas").mousedown(function(e) {
        o(!0)
    }).mouseout(function(e) {
        o(!1)
    }),
    $("#rendercanvas").mousedown(function(e) {
        $("#val_drawings, input#val_alpha, #axes-visible").blur()
    }),
    container = document.getElementById("rendercanvas");
    var G;
    G = Detector.webgl ? new THREE.WebGLRenderer({
        antialias: !0
    }) : new THREE.CanvasRenderer({
        antialias: !0
    });
    var B = document.getElementById("rendercanvas").offsetWidth
      , q = document.getElementById("rendercanvas").offsetHeight;
    G.setSize(B, q),
    container.appendChild(G.domElement);
    var A = new THREE.PerspectiveCamera(45,B / q,1,1e3);
    A.position.z = 3.5,
    A.position.y = 5,
    A.position.x = -3;
    var C = new THREE.OrbitControls(A,G.domElement);
    C.rotateLeft(-1),
    C.rotateUp(-.25),
    C.dollyOut(2.5);
    var L = new THREE.Scene;
    L.background = new THREE.Color(16777215);
    var N, O, D = 6;
    (new THREE.FontLoader).load("/js/threejs/fonts/helvetiker_regular.typeface.json", function(e) {
        O = e,
        i(),
        $(".formelblock").trigger("keyup"),
        l()
    });
    var K, j, W, U = new THREE.Vector3(0,0,0), J = new THREE.Vector3(1,0,0), Q = 255, X = new THREE.ArrowHelper(J,U,D,Q,.75,.2);
    L.add(X),
    J = new THREE.Vector3(0,0,1),
    Q = 3381555;
    var Y = new THREE.ArrowHelper(J,U,D,Q,.75,.2);
    L.add(Y),
    J = new THREE.Vector3(0,1,0),
    Q = 16711680;
    var Z = new THREE.ArrowHelper(J,U,D,Q,.75,.2);
    L.add(Z);
    var ee = new THREE.PlaneGeometry(20,20)
      , ae = new THREE.MeshBasicMaterial({
        color: 16768187,
        side: THREE.DoubleSide,
        opacity: m,
        transparent: !0,
        depthWrite: !1
    })
      , te = new THREE.Mesh(ee,ae);
    te.rotation.x = -Math.PI / 2,
    L.add(te),
    te.receiveShadow = !0;
    var ie = new THREE.GridHelper(20,20,13421772,13421772);
    ie.position = new THREE.Vector3(1,0,0),
    L.add(ie);
    var ne = new THREE.Mesh(ee,ae);
    ne.rotation.y = -Math.PI / 2,
    L.add(ne),
    ne.receiveShadow = !0;
    var re = new THREE.GridHelper(20,20,13421772,13421772);
    re.position = new THREE.Vector3(0,0,0),
    re.rotation.x = -Math.PI / 2,
    re.rotation.z = -Math.PI / 2,
    L.add(re);
    var se = new THREE.Mesh(ee,ae);
    se.rotation.z = -Math.PI / 2,
    L.add(se),
    se.receiveShadow = !0;
    var le = new THREE.GridHelper(20,20,13421772,13421772);
    le.position = new THREE.Vector3(0,0,0),
    le.rotation.x = -Math.PI / 2,
    L.add(le),
    te.visible = !1,
    ie.visible = !1,
    ne.visible = !1,
    re.visible = !1,
    se.visible = !1,
    le.visible = !1;
    var oe = new THREE.PlaneGeometry(20,20)
      , pe = new THREE.MeshPhongMaterial({
        color: 0,
        specular: f,
        shininess: 70,
        side: THREE.DoubleSide,
        transparent: !0,
        opacity: m
    })
      , ce = new THREE.Mesh(oe,pe);
    ce.rotation.x = -Math.PI / 2,
    L.add(ce),
    ce.receiveShadow = !0;
    var he = new THREE.GridHelper(20,20,4539717,4539717);
    he.position = new THREE.Vector3(1,0,0),
    L.add(he);
    var Ee = new THREE.Mesh(oe,pe);
    Ee.rotation.y = -Math.PI / 2,
    L.add(Ee),
    ne.receiveShadow = !0;
    var de = new THREE.GridHelper(20,20,4539717,4539717);
    de.position = new THREE.Vector3(0,0,0),
    de.rotation.x = -Math.PI / 2,
    de.rotation.z = -Math.PI / 2,
    L.add(de);
    var _e = new THREE.Mesh(oe,pe);
    _e.rotation.z = -Math.PI / 2,
    L.add(_e),
    _e.receiveShadow = !0;
    var ue = new THREE.GridHelper(20,20,4539717,4539717);
    ue.position = new THREE.Vector3(0,0,0),
    ue.rotation.x = -Math.PI / 2,
    L.add(ue),
    ce.visible = !1,
    he.visible = !1,
    Ee.visible = !1,
    de.visible = !1,
    _e.visible = !1,
    ue.visible = !1,
    x ? ce.visible = he.visible = !0 : te.visible = ie.visible = !0;
    var we = new THREE.PointLight(10066380,.75,0,1);
    we.position.x = -80,
    we.position.y = 120,
    we.position.z = 130,
    L.add(we);
    var ve = new THREE.PointLight(13430476,.9,0,1);
    ve.position.x = 90,
    ve.position.y = 10,
    ve.position.z = 125,
    L.add(ve);
    var ye = new THREE.SpotLight(16772778,2,100,.9,.7,2);
    ye.position.set(1, 20, 11),
    ye.castShadow = !0,
    ye.shadow.mapSize.width = 1024,
    ye.shadow.mapSize.height = 1024,
    ye.shadow.camera.near = .5,
    ye.shadow.camera.far = 400,
    L.add(ye),
    Detector.webgl && (G.shadowMap.enabled = !0,
    G.shadowMap.type = THREE.PCFSoftShadowMap),
    window.addEventListener("resize", c, !1);
    var me = !1;
    $("#fullscreen").click(function(e) {
        (me = !me) ? ($(".wrapper3d").width("90%"),
        $(".wrapper3d").height("80%"),
        $(".wrapper3dinner").height(.9 * $(window).height()),
        $("#rendercanvas canvas").width("100%"),
        $("#rendercanvas canvas").height("100%")) : ($(".wrapper3d").width("500px"),
        $(".wrapper3d").height("auto"),
        $(".wrapper3dinner").height("400px"),
        $("#rendercanvas canvas").width("500px"),
        $("#rendercanvas canvas").height("400px")),
        B = document.getElementById("rendercanvas").offsetWidth,
        q = document.getElementById("rendercanvas").offsetHeight,
        console.log("Rendering in: " + B + " * " + q),
        G.setSize(B, q),
        c(),
        o(!0),
        p(100),
        $("html, body").animate({
            scrollTop: $("#rendercanvas").offset().top - 50
        }, 1e3)
    }),
    $("kbd").click(function() {
        $("#val_drawings").val().length > 0 ? $("#val_drawings").val($("#val_drawings").val() + "\n" + $(this).text()) : $("#val_drawings").val($("#val_drawings").val() + $(this).text()),
        "coordplanes" == $(this).attr("id") && $(".formelblock").trigger("keyup")
    }),
    $("#axes-visible").click(function(e) {
        b = $(this).prop("checked"),
        n(),
        o(!0),
        p(100)
    }),
    $("input#val_alpha").bind("keyup change", function(e) {
        C.noPan = !0,
        y = parseFloat($(this).val()),
        n(),
        o(!0),
        p(100)
    }).focusout(function(e) {
        C.noPan = !1
    }),
    $("#memvaluelink").click(function(e) {
        return e.preventDefault(),
        $("#lightbox-popup").show(),
        $("#lightbox-center").html('<input type="text" class="linkshare" value="' + _ + '" >'),
        $("#lightbox-center .linkshare").select(),
        $("#lightbox-center").css("margin-top", ($(window).height() - $("#lightbox-center").height()) / 2 + "px"),
        !1
    }),
    $("#fullscreenbtn").click(function() {
        me = !0,
        $("#rendercanvas").addClass("fullscreen-canvas"),
        $("#fullscreenbtn-close").show(),
        h(),
        $("textarea#val_drawings").addClass("fullscreen-val_drawings")
    }),
    $("#fullscreenbtn-close").click(function() {
        me = !1,
        $("#rendercanvas").removeClass("fullscreen-canvas"),
        $("#fullscreenbtn-close").hide(),
        c(),
        $("textarea#val_drawings").removeClass("fullscreen-val_drawings")
    }),
    $("#shaderbtn").click(function() {
        x = !x,
        H = !0,
        n(),
        A.lookAt(z.position),
        o(!0),
        p(100)
    }),
    /msie|trident/i.test(navigator.userAgent) && $(".iehint").show(),
    "" == $("#additionals").text() && $("#additionals").hide(),
    $("#val_drawings").on("keydown", function(e) {
        if (S != $("#val_drawings").val() || e.ctrlKey) {
            S = $("#val_drawings").val();
            var a = !1
              , t = this.selectionStart
              , i = this.selectionEnd;
            i === t && (i = t + 1);
            var n = $(this).val().substring(t, i);
            if ("-" != n && "." != n || (i++,
            n = $(this).val().substring(t, i)),
            (isNaN(n) || " " === n.charAt(0)) && (i = t,
            t -= 1,
            n = $(this).val().substring(t, i)),
            isNaN(n) || " " === n.charAt(0) || "" === n)
                return;
            for (var r = t, s = i; r >= 0; ) {
                if ("-" !== (n = $(this).val().substring(r, i)) && (isNaN(n) || " " === n.charAt(0))) {
                    r++;
                    break
                }
                r--
            }
            for (; s <= $(this).val().length; ) {
                if (n = $(this).val().substring(t, s),
                isNaN(n) || " " === n.charAt(n.length - 1)) {
                    s--;
                    break
                }
                s++
            }
            n = Number($(this).val().substring(r, s));
            var l = $(this).val()
              , o = l.substring(0, r)
              , p = l.substring(s);
            "\n" == l.charAt(s - 1) && (p = "\n" + p);
            var c = ("" + n).length;
            e.ctrlKey && e.altKey && e.shiftKey && 38 == e.keyCode ? (n++,
            a = !0) : e.ctrlKey && e.altKey && e.shiftKey && 40 == e.keyCode ? (n--,
            a = !0) : e.ctrlKey && e.altKey && e.shiftKey && 39 == e.keyCode ? (n += .1,
            a = !0) : e.ctrlKey && e.altKey && e.shiftKey && 37 == e.keyCode && (n -= .1,
            a = !0),
            a && (n = Math.round(1e3 * n) / 1e3,
            $(this).val(o + "" + n + p)),
            $(".formelblock").trigger("keyup");
            var h = this;
            if (a) {
                var d = ("" + n).length;
                return d != c && (s -= c - d),
                window.setTimeout(function() {
                    E(h, r, s)
                }, 10),
                e.preventDefault(),
                !1
            }
        }
    })
});
