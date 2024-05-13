import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

// class MeetingDataSource extends CalendarDataSource {
//   late List<CalendarAppointment> calendarAppointments;

//   MeetingDataSource(List<CalendarAppointment> source) {
//     this.appointments = source.map((e) => e.appointment).toList();
//     this.calendarAppointments = source;
//   }

//   // 특정 일정에 대한 CalendarAppointment 객체 반환
//   // CalendarAppointment 객체를 안전하게 찾는 함수
//   CalendarAppointment? getAppointmentDetails(Appointment appointment) {
//     return calendarAppointments.firstWhere(
//       (item) => item.appointment == appointment,
//       orElse: () => null!, // 요소가 없을 경우 null 반환
//     );
//   }
// }

class MeetingDataSource extends CalendarDataSource {
  List<CalendarAppointment> calendarAppointments; // 기존 일정
  List<MemberAppointment> memberAppointments; // 멤버 일정

  Set<String> displayedMarkers = {};

  MeetingDataSource({
    required this.calendarAppointments,
    required this.memberAppointments,
  }) {
    // 모든 일정을 Appointment 리스트에 병합
    List<Appointment> allAppointments = [
      ...calendarAppointments.map((e) => e.appointment),
      ...memberAppointments.expand((e) => e.appointments),
    ];

    this.appointments = allAppointments;
  }

  // 일정의 출처를 확인하는 로직 추가
  bool isMemberAppointment(Appointment appointment) {
    for (var member in memberAppointments) {
      if (member.appointments.contains(appointment)) {
        return true;
      }
    }
    return false;
  }

  // 멤버 정보를 반환하는 메소드
  MemberAppointment? getMemberInfo(Appointment appointment) {
    for (var member in memberAppointments) {
      if (member.appointments.contains(appointment)) {
        return member;
      }
    }
    return null;
  }

  bool shouldDisplayMarker(Appointment appointment, MemberAppointment member) {
    String markerKey =
        '${member.useremail}-${appointment.startTime.toIso8601String()}';
    if (displayedMarkers.contains(markerKey)) {
      return false; // 이미 표시된 마커
    } else {
      displayedMarkers.add(markerKey);
      return true; // 마커를 표시해야 함
    }
  }
}
