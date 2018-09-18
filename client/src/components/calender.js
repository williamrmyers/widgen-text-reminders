import React, { Component } from 'react';
import BigCalendar from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("en-US");
BigCalendar.momentLocalizer(moment);

class Calender extends React.Component {

  render() {
    return (
      <div style={{ height: 700 }}>
        <BigCalendar
          selectable
          showMultiDayTimes={false}
          events={this.props.events}
          step={60}
          defaultView={"day"}
          views={["day", "agenda", "week", "month"]}
          defaultDate={new Date()}
          // onSelectEvent={this.props.modifyAppointment}
          // onSelectSlot={this.props.createAppointment}
          onSelectSlot={event => alert(event.start, event.end)}
        />
      </div>
    );
  }
}

export default Calender;
