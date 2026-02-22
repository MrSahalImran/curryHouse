import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function PrivacyScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>

      <Text style={styles.sectionTitle}>Who we are</Text>
      <Text style={styles.text}>
        Our website address is: https://www.curryhousejar.no
      </Text>

      <Text style={styles.sectionTitle}>Comments</Text>
      <Text style={styles.text}>
        When visitors leave comments on the site, the information entered in the
        comments form is stored, along with the visitor&apos;s IP address and
        browser version. This is done to help prevent spam.
      </Text>
      <Text style={styles.text}>
        An anonymous string of text generated based on your email address (also
        called a &quot;hash&quot;) may be sent to the Gravatar service to check
        if you have an account there. The Gravatar privacy policy is available
        here: https://automattic.com/privacy/. After your comment has been
        approved, your profile picture will be visible to anyone in connection
        with your comment.
      </Text>

      <Text style={styles.sectionTitle}>Media</Text>
      <Text style={styles.text}>
        If you upload images to your site, avoid uploading images that contain
        information about where they were taken (EXIF GPS). Site visitors can
        download and extract such information from images on your site.
      </Text>

      <Text style={styles.sectionTitle}>Cookies</Text>
      <Text style={styles.text}>
        If you leave a comment on this site, you can ask us to remember your
        name, email, and website. This information is stored in a cookie and is
        there to make things easier for you. You then do not have to re-enter
        this information the next time you leave a comment. These cookies expire
        after one year.
      </Text>
      <Text style={styles.text}>
        If you visit our login page, we will create a temporary cookie to
        determine whether your browser accepts cookies. This cookie does not
        contain any personal information and disappears as soon as you close
        your browser.
      </Text>
      <Text style={styles.text}>
        When you log in, cookies are created that store your login information
        and choices you have made about how content is displayed. Cookies with
        login information expire after two days, while those with display
        choices last for one year. If you check the &quot;Remember me&quot; box,
        your login information will be kept for two weeks. If you log out of
        your account, these cookies will disappear.
      </Text>
      <Text style={styles.text}>
        If you edit or publish an article, an additional cookie will be stored
        in your browser. This cookie does not contain any personal data, but
        only the ID of the article you just edited. It expires after one day.
      </Text>

      <Text style={styles.sectionTitle}>
        Embedded content from other websites
      </Text>
      <Text style={styles.text}>
        Articles on this page may include embedded content (e.g. videos, images,
        articles, etc.). Embedded content from other websites behaves exactly
        the same as if the visitor had visited the website from which the
        embedded content came.
      </Text>
      <Text style={styles.text}>
        These websites may collect information about you, use cookies, embed
        third-party tracking systems, and monitor what you do through this
        embedded content. This includes tracking your actions through the
        embedded content if you have an account and are logged in to the
        website.
      </Text>

      <Text style={styles.sectionTitle}>
        Who we share your information with
      </Text>
      <Text style={styles.text}>
        If you request a password reset, your IP address will be included in the
        password reset email.
      </Text>

      <Text style={styles.sectionTitle}>
        How long we keep information about you
      </Text>
      <Text style={styles.text}>
        If you leave a comment, the comment and information about it will be
        stored indefinitely. This allows us to recognize follow-up comments and
        approve them automatically, rather than placing them in a queue that
        requires manual approval by an editor.
      </Text>
      <Text style={styles.text}>
        For users who register on this website (if this option exists), personal
        data that they provide in their user profile is also stored. All users
        can view, edit and delete their own personal data at any time (except
        for their username). Website administrators can also view and edit this
        information.
      </Text>

      <Text style={styles.sectionTitle}>
        Your rights regarding information about you
      </Text>
      <Text style={styles.text}>
        If you have an account on this site or have left comments, you can
        request to receive an exported file of the personal data we hold about
        you. This includes any data you have provided to us. You can also
        request that we delete any personal data we hold about you. This does
        not include information we are required to retain for administrative,
        legal or security reasons.
      </Text>

      <Text style={styles.sectionTitle}>Where your information is sent</Text>
      <Text style={styles.text}>
        Visitors&apos; comments may be checked through an automatic recognition
        service against spam comments.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
    paddingBottom: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
});
