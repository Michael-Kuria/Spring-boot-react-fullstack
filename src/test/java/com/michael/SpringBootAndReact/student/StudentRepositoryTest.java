package com.michael.SpringBootAndReact.student;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class StudentRepositoryTest {

    @Autowired
    private StudentRepository studentRepository;

    /*@AfterEach
    void tearDown() {
        studentRepository.deleteAll();
    }*/

    @Test
    void selectExistsEmail() {

        String email = "mkim@gmail.com";
        //given
        Student std = new Student(
                "Michael Kimani",
                email,
                Gender.MALE
        );

        studentRepository.save(std);

        //When
        boolean expected = studentRepository.selectExistsEmail(email);

        //then
        assertThat(expected).isTrue();
    }


    @Test
    void checkIfEmailExists() {

        String email = "mkim@gmail.com";

        //When
        boolean expected = studentRepository.selectExistsEmail(email);

        //then
        assertThat(expected).isFalse();
    }
}