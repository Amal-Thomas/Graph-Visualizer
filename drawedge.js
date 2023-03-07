function mark_line(x1, y1, x2, y2, edge_color) {
    c.beginPath();

    if (x1 - x2 == 0) {
        r = 30;
        if (y1 - y2 > 0) {
            r = -30;
        }
        c.moveTo(x1 - offsetx, y1 - offsety + r);
    }
    else {
        let m = (y1 - y2) / (x1 - x2);
        let theta = Math.atan(m);
        r = 30;
        if (x1 - x2 < 0) {
            r = -30;
        }

        c.moveTo(x1 - offsetx - r * Math.cos(theta), y1 - offsety - r * Math.sin(theta));
    }

    if (x1 - x2 == 0) {
        r = 30;
        if (y1 - y2 > 0) {
            r = -30;
        }
        c.lineTo(x2 - offsetx, y2 - offsety - r);
    }
    else {
        let m = (y1 - y2) / (x1 - x2);
        let theta = Math.atan(m);
        r = 30;
        if (x1 - x2 < 0) {
            r = -30;
        }

        c.lineTo(x2 - offsetx + r * Math.cos(theta), y2 - offsety + r * Math.sin(theta));
    }

    c.strokeStyle = edge_color;
    c.stroke();
}

function mark_arc(x1, y1, x2, y2, reverse, for_traversal, edge_color) {
    c.beginPath();
    let ccw = false;
    let d = dist(x1, y1, x2, y2)

    let f = d / 5;
    if (f > 10) {
        f = 10;
    }
    let arc_radius = d * d / (8 * f) + f / 2;
    let m = (y1 - y2) / (x1 - x2);
    let theta_m_inv = Math.atan(-1 / m);
    let arrow = 0;
    let arrowx = 0;
    let arrowy = 0;
    let weightx = 0;
    let weighty = 0;
    let weight_offset = 10;
    let weight_error_flag = false;
    if (reverse) {

        let arc_x = (x1 + x2) / 2 - (arc_radius - f) * Math.cos(theta_m_inv);
        let arc_y = (y1 + y2) / 2 - (arc_radius - f) * Math.sin(theta_m_inv);
        let m1 = (y1 - arc_y) / (x1 - arc_x);
        let m2 = (y2 - arc_y) / (x2 - arc_x);
        let arc_end = Math.atan(m1);
        let arc_start = Math.atan(m2);
        let d_arc = 32 / arc_radius;
        if (x2 < x1) {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_start = arc_start + Math.PI;
                weight_error_flag = true;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_start = arc_start - Math.PI;
                weight_error_flag = true;
            }
        }
        else {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_end = arc_end + Math.PI;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_end = arc_end - Math.PI;
            }
        }

        if (y2 > y1) {
            ccw = true;
            d_arc = -d_arc;
        }

        c.arc(arc_x - offsetx, arc_y - offsety, arc_radius, arc_start + d_arc, arc_end - d_arc, ccw);
        arrow = arc_start + d_arc;
        arrowx = arc_x - offsetx + arc_radius * Math.cos(arrow);
        arrowy = arc_y - offsety + arc_radius * Math.sin(arrow);



        weightx = arc_x - offsetx + (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
        weighty = arc_y - offsety + (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);

        if (weighty > arc_y - offsety) weighty = weighty + 15;

        if (weight_error_flag) {
            weightx = arc_x - offsetx - (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
            weighty = arc_y - offsety - (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);
        }

        if (y2 > y1) {
            arrow = arrow - Math.PI;
        }
        arrow = arrow - Math.PI;
    }
    else {

        let arc_x = (x1 + x2) / 2 + (arc_radius - f) * Math.cos(theta_m_inv);
        let arc_y = (y1 + y2) / 2 + (arc_radius - f) * Math.sin(theta_m_inv);
        let m1 = (y1 - arc_y) / (x1 - arc_x);
        let m2 = (y2 - arc_y) / (x2 - arc_x);
        let arc_start = Math.PI + Math.atan(m1);
        let arc_end = Math.PI + Math.atan(m2);
        let d_arc = 32 / arc_radius;
        if (x2 < x1) {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_start = arc_start + Math.PI;
                weight_error_flag = true;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_start = arc_start - Math.PI;
                weight_error_flag = true;
            }


        }
        else {
            if (arc_end - arc_start < -Math.PI / 2) {
                arc_end = arc_end + Math.PI;
            }
            if (arc_end - arc_start > Math.PI / 2) {
                arc_end = arc_end - Math.PI;
            }

        }
        if (y2 > y1) {
            ccw = true;
            d_arc = -d_arc;
        }
        c.arc(arc_x - offsetx, arc_y - offsety, arc_radius, arc_start + d_arc, arc_end - d_arc, ccw);
        arrow = arc_end - d_arc;

        arrowx = arc_x - offsetx + arc_radius * Math.cos(arrow);
        arrowy = arc_y - offsety + arc_radius * Math.sin(arrow);

        weightx = arc_x - offsetx + (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
        weighty = arc_y - offsety + (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);

        if (weighty >= arc_y - offsety) weighty = weighty + 15;

        if (weight_error_flag) {
            weightx = arc_x - offsetx - (arc_radius + weight_offset) * Math.cos((arc_start + arc_end) / 2);
            weighty = arc_y - offsety - (arc_radius + weight_offset) * Math.sin((arc_start + arc_end) / 2);
        }


        if (y2 > y1) {
            arrow = arrow - Math.PI;
        }
    }


    c.strokeStyle = edge_color;
    c.stroke();

    c.save();
    c.translate(arrowx, arrowy);
    c.rotate(arrow);
    c.font = "20px serif";
    c.fillStyle = edge_color;
    c.fillText('\u25BC', 0, 0);
    c.restore();

    return [weightx, weighty];
}