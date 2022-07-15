package com.michael.SpringBootAndReact.student;

import com.michael.SpringBootAndReact.student.exception.BadRequestException;
import com.michael.SpringBootAndReact.student.exception.StudentNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    private StudentService underTest;
    @BeforeEach
    void setUp() {
        underTest = new StudentService(studentRepository);
    }

    @Test
    void canGetAllStudents() {
        //When
        underTest.getAllStudents();

        //then - Verify that the getAllStudents Method called findAll method from the studentRepository
        verify(studentRepository).findAll();
    }

    @Test
    void canAddStudent() {
        // given
        Student student = new Student("Michael K", "mk@gmail.com", Gender.MALE);

        //When
        underTest.addStudent(student);

        //then
        ArgumentCaptor<Student> studentArgumentCaptor = ArgumentCaptor.forClass(Student.class);
        // Check that the save method from the StudentRepository was invoked, at the same time capture the student value that was passed
        verify(studentRepository).save(studentArgumentCaptor.capture());

        // confirm that the student passed is the same as the one created
        assertThat(studentArgumentCaptor.getValue()).isEqualTo(student);


    }

    @Test
    void willThrowExceptionOnAvailableEmail() {
        // given
        Student student = new Student("Michael K", "mk@gmail.com", Gender.MALE);

        given(studentRepository.selectExistsEmail(anyString())).willReturn(true);
        //When

        //then
        assertThatThrownBy(() -> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() +" is taken");

        //Confirm that no student was savec
        verify(studentRepository, never()).save(any());

    }


    @Test
    void deleteStudent() {
        //given
        long id = 10;
        given(studentRepository.existsById(id)).willReturn(true);
        //When
        underTest.deleteStudent(id);
        //Then
        verify(studentRepository).deleteById(id);


    }

    @Test
    void deleteStudentWillThrowException() {
        //given
        Student student = new Student("Michael K", "mk@gmail.com", Gender.MALE);
        given(studentRepository.existsById(null)).willReturn(false);
        //When
        //Then
        assertThatThrownBy(() ->  underTest.deleteStudent(student.getId()))
                .isInstanceOf(StudentNotFoundException.class)
                .hasMessageContaining("Student with id = " + student.getId() +" doesn't exist");


        verify(studentRepository, never()).deleteById(any());
    }
}