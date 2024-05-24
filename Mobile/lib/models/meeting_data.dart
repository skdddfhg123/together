import 'package:calendar/controllers/meeting_controller.dart';
import 'package:flutter/material.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';

class MeetingDataSource extends CalendarDataSource {
  List<CalendarAppointment> calendarAppointments; // 기존 일정
  List<MemberAppointment> memberAppointments; // 멤버 일정

  Set<String> displayedMarkers = {};
  Set<String> displayedMembers = {};

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

  // 소셜 일정을 확인하는 메소드
  bool isSocialAppointment(Appointment appointment) {
    for (var calendarAppointment in calendarAppointments) {
      if (calendarAppointment.appointment == appointment) {
        return calendarAppointment.isSocial;
      }
    }
    return false;
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

  // 멤버 닉네임으로 멤버를 찾는 메소드
  MemberAppointment? getMemberByNickname(String nickname) {
    for (var member in memberAppointments) {
      if (member.nickname == nickname) {
        return member;
      }
    }
    return null;
  }
}
